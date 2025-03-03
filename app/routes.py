from flask import Blueprint, render_template, request, jsonify, current_app, flash, redirect, url_for
import os
import json
from datetime import datetime
from app.api.bluesky import BlueskyAPI
from app.models.sentiment import SentimentAnalyzer
from app.utils.data_processor import DataProcessor

# Create a blueprint for the main routes
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Render the home page."""
    return render_template('index.html')

@main_bp.route('/dashboard')
def dashboard():
    """Render the dashboard page."""
    return render_template('dashboard.html')

@main_bp.route('/fetch-data', methods=['POST'])
def fetch_data():
    """Fetch data from Bluesky API."""
    try:
        # Get form data
        keywords = request.form.get('keywords', '').split(',')
        limit = int(request.form.get('limit', 100))
        
        # Initialize Bluesky API
        bluesky_api = BlueskyAPI(
            username=current_app.config['BLUESKY_USERNAME'],
            password=current_app.config['BLUESKY_PASSWORD']
        )
        
        # Fetch data
        data = bluesky_api.fetch_posts(keywords, limit)
        
        # Process data
        processor = DataProcessor()
        processed_data = processor.preprocess(data)
        
        # Save data to file
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"data/bluesky_data_{timestamp}.json"
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        
        with open(filename, 'w') as f:
            json.dump(processed_data, f)
        
        flash(f"Successfully fetched and processed {len(data)} posts.", "success")
        return redirect(url_for('main.dashboard'))
    
    except Exception as e:
        flash(f"Error fetching data: {str(e)}", "error")
        return redirect(url_for('main.index'))

@main_bp.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of fetched data."""
    try:
        # Get the data file
        data_file = request.form.get('data_file')
        
        # Load data
        with open(data_file, 'r') as f:
            data = json.load(f)
        
        # Initialize sentiment analyzer
        analyzer = SentimentAnalyzer()
        
        # Analyze sentiment
        results = analyzer.analyze_batch(data)
        
        # Save results
        output_file = data_file.replace('.json', '_sentiment.json')
        with open(output_file, 'w') as f:
            json.dump(results, f)
        
        flash(f"Successfully analyzed sentiment for {len(results)} posts.", "success")
        return redirect(url_for('main.dashboard'))
    
    except Exception as e:
        flash(f"Error analyzing sentiment: {str(e)}", "error")
        return redirect(url_for('main.dashboard'))

@main_bp.route('/get-data-files')
def get_data_files():
    """Get a list of available data files."""
    try:
        data_files = []
        for file in os.listdir('data'):
            if file.endswith('.json') and not file.endswith('_sentiment.json'):
                data_files.append(file)
        
        return jsonify({'data_files': data_files})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main_bp.route('/get-sentiment-files')
def get_sentiment_files():
    """Get a list of available sentiment files."""
    try:
        sentiment_files = []
        for file in os.listdir('data'):
            if file.endswith('_sentiment.json'):
                sentiment_files.append(file)
        
        return jsonify({'sentiment_files': sentiment_files})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main_bp.route('/visualize/<file_type>/<filename>')
def visualize(file_type, filename):
    """Visualize data or sentiment results."""
    try:
        # Load data
        with open(f"data/{filename}", 'r') as f:
            data = json.load(f)
        
        # Render visualization page
        return render_template('visualization.html', data=data, file_type=file_type)
    
    except Exception as e:
        flash(f"Error visualizing data: {str(e)}", "error")
        return redirect(url_for('main.dashboard')) 