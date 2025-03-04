"""API routes for the Bluesky Stock Analyzer."""

from flask import Blueprint, request, jsonify, current_app
import os
import json
from datetime import datetime
import traceback

from app.api.bluesky import BlueskyAPI
from app.models.sentiment import SentimentAnalyzer
from app.utils.data_processor import DataProcessor

# Create a blueprint for the API routes
api_bp = Blueprint('api', __name__)


@api_bp.route('/health', methods=['GET'])
def health_check():
    """API health check endpoint."""
    return jsonify({
        'status': 'ok',
        'message': 'API is running'
    })


@api_bp.route('/fetch-data', methods=['POST'])
def fetch_data():
    """Fetch data from Bluesky API."""
    try:
        # Get JSON data
        data = request.get_json()
        keywords = data.get('keywords', '').split(',')
        limit = int(data.get('limit', 100))
        
        # Initialize Bluesky API
        bluesky_api = BlueskyAPI(
            username=current_app.config['BLUESKY_USERNAME'],
            password=current_app.config['BLUESKY_PASSWORD']
        )
        
        # Fetch data
        posts = bluesky_api.fetch_posts(keywords, limit)
        
        # Process data
        processor = DataProcessor()
        processed_data = processor.preprocess(posts)
        
        # Save data to file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"data/bluesky_data_{timestamp}.json"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(processed_data, f)
        
        return jsonify({
            'status': 'success',
            'message': f'Successfully fetched and processed {len(posts)} posts',
            'data_file': filename,
            'post_count': len(posts)
        })
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': f'Error fetching data: {str(e)}'
        }), 500


@api_bp.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of fetched data."""
    try:
        # Get JSON data
        data = request.get_json()
        data_file = data.get('data_file')
        
        # Load data
        with open(data_file, 'r') as f:
            posts = json.load(f)
        
        # Initialize sentiment analyzer
        analyzer = SentimentAnalyzer()
        
        # Analyze sentiment
        results = analyzer.analyze_batch(posts)
        
        # Save results
        output_file = data_file.replace('.json', '_sentiment.json')
        with open(output_file, 'w') as f:
            json.dump(results, f)
        
        return jsonify({
            'status': 'success',
            'message': f'Successfully analyzed sentiment for {len(results)} posts',
            'sentiment_file': output_file,
            'result_count': len(results)
        })
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': f'Error analyzing sentiment: {str(e)}'
        }), 500


@api_bp.route('/data-files', methods=['GET'])
def get_data_files():
    """Get a list of available data files."""
    try:
        data_files = []
        for file in os.listdir('data'):
            if file.endswith('.json') and not file.endswith('_sentiment.json'):
                data_files.append(file)
        
        return jsonify({
            'status': 'success',
            'data_files': data_files
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error getting data files: {str(e)}'
        }), 500


@api_bp.route('/sentiment-files', methods=['GET'])
def get_sentiment_files():
    """Get a list of available sentiment files."""
    try:
        sentiment_files = []
        for file in os.listdir('data'):
            if file.endswith('_sentiment.json'):
                sentiment_files.append(file)
        
        return jsonify({
            'status': 'success',
            'sentiment_files': sentiment_files
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error getting sentiment files: {str(e)}'
        }), 500


@api_bp.route('/file-data/<filename>', methods=['GET'])
def get_file_data(filename):
    """Get data from a specific file."""
    try:
        with open(f"data/{filename}", 'r') as f:
            data = json.load(f)
        
        return jsonify({
            'status': 'success',
            'data': data
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error getting file data: {str(e)}'
        }), 500


@api_bp.route('/trending-topics', methods=['GET'])
def get_trending_topics():
    """Get trending topics from Bluesky."""
    try:
        # Initialize Bluesky API
        bluesky_api = BlueskyAPI(
            username=current_app.config['BLUESKY_USERNAME'],
            password=current_app.config['BLUESKY_PASSWORD']
        )
        
        # Get trending topics
        topics = bluesky_api.get_trending_topics()
        
        # Convert to list of objects for easier frontend processing
        trending_list = [
            {'topic': topic, 'count': count}
            for topic, count in topics.items()
        ]
        
        # Sort by count (descending)
        trending_list.sort(key=lambda x: x['count'], reverse=True)
        
        return jsonify({
            'status': 'success',
            'trending_topics': trending_list
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error getting trending topics: {str(e)}'
        }), 500


@api_bp.route('/stock-summary', methods=['GET'])
def get_stock_summary():
    """Get summary of sentiment for specific stocks."""
    try:
        # Get query parameters
        stocks = request.args.get('stocks', '').split(',')
        
        if not stocks or stocks[0] == '':
            return jsonify({
                'status': 'error',
                'message': 'No stocks specified'
            }), 400
        
        # Get all sentiment files
        sentiment_files = []
        for file in os.listdir('data'):
            if file.endswith('_sentiment.json'):
                sentiment_files.append(file)
        
        # Load all sentiment data
        all_sentiment_data = []
        for file in sentiment_files:
            with open(f"data/{file}", 'r') as f:
                all_sentiment_data.extend(json.load(f))
        
        # Filter by stocks
        stock_data = {}
        for stock in stocks:
            stock_data[stock] = {
                'positive': 0,
                'neutral': 0,
                'negative': 0,
                'total': 0,
                'avg_sentiment': 0
            }
        
        # Process sentiment data
        for item in all_sentiment_data:
            if 'stock_symbols' in item and 'sentiment' in item:
                for stock in item['stock_symbols']:
                    if stock in stock_data:
                        sentiment = item['sentiment']['consensus']
                        stock_data[stock][sentiment] += 1
                        stock_data[stock]['total'] += 1
                        
                        # Add compound sentiment score (from VADER)
                        if 'vader' in item['sentiment'] and 'compound' in item['sentiment']['vader']:
                            stock_data[stock]['avg_sentiment'] += item['sentiment']['vader']['compound']
        
        # Calculate average sentiment
        for stock in stock_data:
            if stock_data[stock]['total'] > 0:
                stock_data[stock]['avg_sentiment'] /= stock_data[stock]['total']
        
        return jsonify({
            'status': 'success',
            'stock_data': stock_data
        })
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': f'Error getting stock summary: {str(e)}'
        }), 500 