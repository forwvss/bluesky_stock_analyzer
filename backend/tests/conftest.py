"""Pytest configuration file with fixtures for the Bluesky Stock Analyzer application."""

import os
import sys
import pytest
from flask import Flask
import json
from datetime import datetime

# Add the parent directory to the path so we can import the app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from app.api.bluesky import BlueskyAPI
from app.models.sentiment import SentimentAnalyzer
from app.utils.data_processor import DataProcessor


@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    app = create_app({
        'TESTING': True,
        'SECRET_KEY': 'test_secret_key',
        'DATABASE_URI': 'sqlite:///:memory:',
        'BLUESKY_USERNAME': 'test_user',
        'BLUESKY_PASSWORD': 'test_password'
    })
    
    # Create an application context
    with app.app_context():
        yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()


@pytest.fixture
def sample_posts():
    """Sample posts data for testing."""
    return [
        {
            "id": "post1",
            "text": "I really love the new $AAPL product! It's amazing and innovative.",
            "user": "user1",
            "timestamp": datetime.now().isoformat(),
            "likes": 10,
            "reposts": 5
        },
        {
            "id": "post2",
            "text": "The $MSFT earnings report was disappointing. Stock might drop.",
            "user": "user2",
            "timestamp": datetime.now().isoformat(),
            "likes": 3,
            "reposts": 1
        },
        {
            "id": "post3",
            "text": "Neutral thoughts about $GOOGL, not sure where it's headed.",
            "user": "user3",
            "timestamp": datetime.now().isoformat(),
            "likes": 5,
            "reposts": 2
        }
    ]


@pytest.fixture
def sample_sentiment_results():
    """Sample sentiment analysis results for testing."""
    return [
        {
            "id": "post1",
            "text": "I really love the new $AAPL product! It's amazing and innovative.",
            "sentiment": {
                "vader": {"neg": 0.0, "neu": 0.4, "pos": 0.6, "compound": 0.8},
                "textblob": {"polarity": 0.75, "subjectivity": 0.8},
                "transformer": [
                    {"label": "positive", "score": 0.9},
                    {"label": "neutral", "score": 0.08},
                    {"label": "negative", "score": 0.02}
                ],
                "consensus": "positive"
            },
            "stock_symbols": ["AAPL"]
        },
        {
            "id": "post2",
            "text": "The $MSFT earnings report was disappointing. Stock might drop.",
            "sentiment": {
                "vader": {"neg": 0.6, "neu": 0.4, "pos": 0.0, "compound": -0.6},
                "textblob": {"polarity": -0.5, "subjectivity": 0.7},
                "transformer": [
                    {"label": "positive", "score": 0.05},
                    {"label": "neutral", "score": 0.15},
                    {"label": "negative", "score": 0.8}
                ],
                "consensus": "negative"
            },
            "stock_symbols": ["MSFT"]
        },
        {
            "id": "post3",
            "text": "Neutral thoughts about $GOOGL, not sure where it's headed.",
            "sentiment": {
                "vader": {"neg": 0.1, "neu": 0.8, "pos": 0.1, "compound": 0.0},
                "textblob": {"polarity": 0.0, "subjectivity": 0.5},
                "transformer": [
                    {"label": "positive", "score": 0.2},
                    {"label": "neutral", "score": 0.7},
                    {"label": "negative", "score": 0.1}
                ],
                "consensus": "neutral"
            },
            "stock_symbols": ["GOOGL"]
        }
    ]


@pytest.fixture
def mock_bluesky_api(monkeypatch):
    """Mock the BlueskyAPI class for testing."""
    class MockBlueskyAPI(BlueskyAPI):
        def __init__(self, username=None, password=None):
            self.username = username or "test_user"
            self.password = password or "test_password"
            self.client = None
            self.connected = False
        
        def connect(self):
            self.connected = True
            return True
        
        def fetch_posts(self, keywords, limit=100, days_back=7):
            if not self.connected:
                raise Exception("Not connected to Bluesky API")
            
            # Return mock data based on keywords
            sample_data = []
            for keyword in keywords:
                sample_data.append({
                    "id": f"post_{keyword}",
                    "text": f"This is a post about ${keyword} stock performance.",
                    "user": "test_user",
                    "timestamp": datetime.now().isoformat(),
                    "likes": 5,
                    "reposts": 2
                })
            
            return sample_data[:limit]
    
    monkeypatch.setattr("app.api.bluesky.BlueskyAPI", MockBlueskyAPI)
    return MockBlueskyAPI()


@pytest.fixture
def data_processor():
    """DataProcessor instance for testing."""
    return DataProcessor()


@pytest.fixture
def sentiment_analyzer():
    """SentimentAnalyzer instance for testing."""
    return SentimentAnalyzer(use_transformers=False)  # Disable transformers for faster tests 