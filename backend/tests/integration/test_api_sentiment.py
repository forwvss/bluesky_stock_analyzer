"""Integration tests for the interaction between BlueskyAPI and SentimentAnalyzer."""

import pytest
from unittest.mock import patch, MagicMock

from app.api.bluesky import BlueskyAPI
from app.models.sentiment import SentimentAnalyzer


class TestApiSentimentIntegration:
    """Integration tests for BlueskyAPI and SentimentAnalyzer."""

    @patch("app.api.bluesky.Client")
    def test_fetch_and_analyze(self, mock_client):
        """Test fetching posts and analyzing sentiment."""
        # Setup BlueskyAPI mock
        mock_client_instance = MagicMock()
        mock_client.return_value = mock_client_instance
        
        # Mock search_posts method
        mock_post1 = {"uri": "post1", "record": {"text": "I love $AAPL products!"}}
        mock_post2 = {"uri": "post2", "record": {"text": "Disappointed with $MSFT earnings."}}
        mock_client_instance.search_posts.return_value = {"posts": [mock_post1, mock_post2]}
        
        # Mock get_post_thread method
        def mock_get_thread(params):
            uri = params.get("uri", "")
            if "post1" in uri:
                return {
                    "thread": {
                        "post": {
                            "author": {"handle": "user1"},
                            "record": {"text": "I love $AAPL products!"},
                            "likeCount": 10,
                            "repostCount": 5
                        }
                    }
                }
            else:
                return {
                    "thread": {
                        "post": {
                            "author": {"handle": "user2"},
                            "record": {"text": "Disappointed with $MSFT earnings."},
                            "likeCount": 3,
                            "repostCount": 1
                        }
                    }
                }
        
        mock_client_instance.get_post_thread.side_effect = mock_get_thread
        
        # Initialize API and fetch posts
        api = BlueskyAPI(username="test_user", password="test_pass")
        posts = api.fetch_posts(["AAPL", "MSFT"], limit=2)
        
        # Initialize sentiment analyzer and analyze posts
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = analyzer.analyze_batch(posts)
        
        # Assertions
        assert len(results) == 2
        
        # Check first post (positive sentiment)
        assert results[0]["text"] == "I love $AAPL products!"
        assert "sentiment" in results[0]
        assert results[0]["sentiment"]["consensus"] == "positive"
        assert "AAPL" in results[0]["stock_symbols"]
        
        # Check second post (negative sentiment)
        assert results[1]["text"] == "Disappointed with $MSFT earnings."
        assert "sentiment" in results[1]
        assert results[1]["sentiment"]["consensus"] == "negative"
        assert "MSFT" in results[1]["stock_symbols"]

    @patch("app.api.bluesky.Client")
    def test_fetch_and_analyze_empty_results(self, mock_client):
        """Test fetching posts with no results and analyzing sentiment."""
        # Setup BlueskyAPI mock
        mock_client_instance = MagicMock()
        mock_client.return_value = mock_client_instance
        
        # Mock empty search results
        mock_client_instance.search_posts.return_value = {"posts": []}
        
        # Initialize API and fetch posts
        api = BlueskyAPI(username="test_user", password="test_pass")
        posts = api.fetch_posts(["NONEXISTENT"], limit=10)
        
        # Initialize sentiment analyzer and analyze posts
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = analyzer.analyze_batch(posts)
        
        # Assertions
        assert len(results) == 0

    @patch("app.api.bluesky.Client")
    def test_fetch_and_analyze_with_errors(self, mock_client):
        """Test handling errors during fetch and analyze process."""
        # Setup BlueskyAPI mock
        mock_client_instance = MagicMock()
        mock_client.return_value = mock_client_instance
        
        # Mock search_posts method
        mock_post1 = {"uri": "post1", "record": {"text": "I love $AAPL products!"}}
        mock_post2 = {"uri": "post2", "record": {}}  # Missing text field
        mock_post3 = {"uri": "post3", "record": {"text": "Neutral about $GOOGL"}}
        mock_client_instance.search_posts.return_value = {"posts": [mock_post1, mock_post2, mock_post3]}
        
        # Mock get_post_thread method
        def mock_get_thread(params):
            uri = params.get("uri", "")
            if "post1" in uri:
                return {
                    "thread": {
                        "post": {
                            "author": {"handle": "user1"},
                            "record": {"text": "I love $AAPL products!"},
                            "likeCount": 10,
                            "repostCount": 5
                        }
                    }
                }
            elif "post2" in uri:
                return {
                    "thread": {
                        "post": {
                            "author": {"handle": "user2"},
                            "record": {},  # Missing text field
                            "likeCount": 3,
                            "repostCount": 1
                        }
                    }
                }
            else:
                return {
                    "thread": {
                        "post": {
                            "author": {"handle": "user3"},
                            "record": {"text": "Neutral about $GOOGL"},
                            "likeCount": 5,
                            "repostCount": 2
                        }
                    }
                }
        
        mock_client_instance.get_post_thread.side_effect = mock_get_thread
        
        # Initialize API and fetch posts
        api = BlueskyAPI(username="test_user", password="test_pass")
        posts = api.fetch_posts(["AAPL", "MSFT", "GOOGL"], limit=3)
        
        # Initialize sentiment analyzer and analyze posts
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = analyzer.analyze_batch(posts)
        
        # Assertions
        assert len(results) == 2  # Should skip the post with missing text
        
        # Check first post (positive sentiment)
        assert results[0]["text"] == "I love $AAPL products!"
        assert "sentiment" in results[0]
        
        # Check second post (neutral sentiment)
        assert results[1]["text"] == "Neutral about $GOOGL"
        assert "sentiment" in results[1] 