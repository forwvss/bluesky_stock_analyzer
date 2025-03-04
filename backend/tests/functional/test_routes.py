"""Functional tests for the Flask application routes."""

import pytest
import os
import json
from unittest.mock import patch, mock_open


class TestRoutes:
    """Tests for the Flask application routes."""

    def test_index_route(self, client):
        """Test the index route."""
        response = client.get('/')
        assert response.status_code == 200
        assert b'<!DOCTYPE html>' in response.data

    def test_dashboard_route(self, client):
        """Test the dashboard route."""
        response = client.get('/dashboard')
        assert response.status_code == 200
        assert b'<!DOCTYPE html>' in response.data

    @patch('app.routes.BlueskyAPI')
    @patch('app.routes.DataProcessor')
    def test_fetch_data_route_success(self, mock_processor, mock_api, client):
        """Test the fetch-data route with successful API response."""
        # Setup mocks
        mock_api_instance = mock_api.return_value
        mock_processor_instance = mock_processor.return_value
        
        # Mock API response
        mock_api_instance.fetch_posts.return_value = [
            {"id": "post1", "text": "Test post about $AAPL"}
        ]
        
        # Mock processor response
        mock_processor_instance.preprocess.return_value = [
            {"id": "post1", "text": "Test post about $AAPL", "stock_symbols": ["AAPL"]}
        ]
        
        # Test
        with patch('builtins.open', mock_open()) as mock_file:
            with patch('json.dump') as mock_json_dump:
                with patch('os.makedirs') as mock_makedirs:
                    response = client.post('/fetch-data', data={
                        'keywords': 'AAPL,MSFT',
                        'limit': '10'
                    }, follow_redirects=True)
        
        # Assertions
        assert response.status_code == 200
        mock_api.assert_called_once()
        mock_api_instance.fetch_posts.assert_called_once_with(['AAPL', 'MSFT'], 10)
        mock_processor.assert_called_once()
        mock_processor_instance.preprocess.assert_called_once()
        mock_makedirs.assert_called_once()
        mock_file.assert_called_once()
        mock_json_dump.assert_called_once()

    @patch('app.routes.BlueskyAPI')
    def test_fetch_data_route_api_failure(self, mock_api, client):
        """Test the fetch-data route with API failure."""
        # Setup mock to raise exception
        mock_api_instance = mock_api.return_value
        mock_api_instance.fetch_posts.side_effect = Exception("API Error")
        
        # Test
        response = client.post('/fetch-data', data={
            'keywords': 'AAPL',
            'limit': '10'
        }, follow_redirects=True)
        
        # Assertions
        assert response.status_code == 200
        assert b'Error fetching data' in response.data
        mock_api.assert_called_once()
        mock_api_instance.fetch_posts.assert_called_once()

    @patch('app.routes.SentimentAnalyzer')
    def test_analyze_sentiment_route_success(self, mock_analyzer, client, tmp_path):
        """Test the analyze-sentiment route with successful analysis."""
        # Setup mock
        mock_analyzer_instance = mock_analyzer.return_value
        
        # Create a temporary data file
        data_file = os.path.join(tmp_path, "test_data.json")
        with open(data_file, 'w') as f:
            json.dump([{"id": "post1", "text": "Test post"}], f)
        
        # Mock analyzer response
        mock_analyzer_instance.analyze_batch.return_value = [
            {
                "id": "post1",
                "text": "Test post",
                "sentiment": {
                    "vader": {"compound": 0.5},
                    "textblob": {"polarity": 0.5},
                    "consensus": "positive"
                }
            }
        ]
        
        # Test
        with patch('builtins.open', mock_open(read_data='[{"id": "post1", "text": "Test post"}]')) as mock_file:
            with patch('json.load') as mock_json_load:
                with patch('json.dump') as mock_json_dump:
                    mock_json_load.return_value = [{"id": "post1", "text": "Test post"}]
                    response = client.post('/analyze-sentiment', data={
                        'data_file': data_file
                    }, follow_redirects=True)
        
        # Assertions
        assert response.status_code == 200
        mock_analyzer.assert_called_once()
        mock_analyzer_instance.analyze_batch.assert_called_once()
        mock_file.assert_called()
        mock_json_dump.assert_called_once()

    @patch('app.routes.SentimentAnalyzer')
    def test_analyze_sentiment_route_failure(self, mock_analyzer, client):
        """Test the analyze-sentiment route with analysis failure."""
        # Setup mock to raise exception
        mock_analyzer_instance = mock_analyzer.return_value
        mock_analyzer_instance.analyze_batch.side_effect = Exception("Analysis Error")
        
        # Test
        with patch('builtins.open', mock_open(read_data='[{"id": "post1", "text": "Test post"}]')):
            with patch('json.load') as mock_json_load:
                mock_json_load.return_value = [{"id": "post1", "text": "Test post"}]
                response = client.post('/analyze-sentiment', data={
                    'data_file': 'test_data.json'
                }, follow_redirects=True)
        
        # Assertions
        assert response.status_code == 200
        assert b'Error analyzing sentiment' in response.data
        mock_analyzer.assert_called_once()
        mock_analyzer_instance.analyze_batch.assert_called_once()

    @patch('os.listdir')
    def test_get_data_files_route(self, mock_listdir, client):
        """Test the get-data-files route."""
        # Setup mock
        mock_listdir.return_value = [
            'data_file1.json',
            'data_file2.json',
            'sentiment_file.json'  # Should be filtered out
        ]
        
        # Test
        response = client.get('/get-data-files')
        
        # Assertions
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'data_files' in data
        assert len(data['data_files']) == 2
        assert 'data_file1.json' in data['data_files']
        assert 'data_file2.json' in data['data_files']

    @patch('os.listdir')
    def test_get_sentiment_files_route(self, mock_listdir, client):
        """Test the get-sentiment-files route."""
        # Setup mock
        mock_listdir.return_value = [
            'data_file1.json',
            'data_file2_sentiment.json',
            'data_file3_sentiment.json'
        ]
        
        # Test
        response = client.get('/get-sentiment-files')
        
        # Assertions
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'sentiment_files' in data
        assert len(data['sentiment_files']) == 2
        assert 'data_file2_sentiment.json' in data['sentiment_files']
        assert 'data_file3_sentiment.json' in data['sentiment_files']

    def test_visualize_route_success(self, client):
        """Test the visualize route with successful visualization."""
        # Test
        with patch('builtins.open', mock_open(read_data='[{"id": "post1", "text": "Test post"}]')):
            with patch('json.load') as mock_json_load:
                mock_json_load.return_value = [{"id": "post1", "text": "Test post"}]
                response = client.get('/visualize/data/test_data.json')
        
        # Assertions
        assert response.status_code == 200
        assert b'<!DOCTYPE html>' in response.data

    def test_visualize_route_failure(self, client):
        """Test the visualize route with visualization failure."""
        # Test with file not found
        with patch('builtins.open', mock_open()) as mock_file:
            mock_file.side_effect = FileNotFoundError("File not found")
            response = client.get('/visualize/data/nonexistent.json', follow_redirects=True)
        
        # Assertions
        assert response.status_code == 200
        assert b'Error visualizing data' in response.data 