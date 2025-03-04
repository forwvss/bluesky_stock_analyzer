"""Unit tests for the BlueskyAPI class."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
import os

from app.api.bluesky import BlueskyAPI


class TestBlueskyAPI:
    """Tests for the BlueskyAPI class."""

    def test_init_with_credentials(self):
        """Test initialization with provided credentials."""
        api = BlueskyAPI(username="test_user", password="test_pass")
        assert api.username == "test_user"
        assert api.password == "test_pass"
        assert api.client is None

    def test_init_with_env_vars(self, monkeypatch):
        """Test initialization with environment variables."""
        monkeypatch.setenv("BLUESKY_USERNAME", "env_user")
        monkeypatch.setenv("BLUESKY_PASSWORD", "env_pass")
        
        api = BlueskyAPI()
        assert api.username == "env_user"
        assert api.password == "env_pass"

    def test_init_without_credentials(self, monkeypatch):
        """Test initialization without credentials."""
        # Ensure environment variables are not set
        monkeypatch.delenv("BLUESKY_USERNAME", raising=False)
        monkeypatch.delenv("BLUESKY_PASSWORD", raising=False)
        
        api = BlueskyAPI()
        assert api.username is None
        assert api.password is None

    @patch("app.api.bluesky.Client")
    def test_connect_success(self, mock_client):
        """Test successful connection to Bluesky API."""
        # Setup mock
        mock_client_instance = MagicMock()
        mock_client.return_value = mock_client_instance
        
        # Test
        api = BlueskyAPI(username="test_user", password="test_pass")
        result = api.connect()
        
        # Assertions
        assert result is True
        mock_client.assert_called_once()
        mock_client_instance.login.assert_called_once_with("test_user", "test_pass")
        assert api.client == mock_client_instance

    @patch("app.api.bluesky.Client")
    def test_connect_failure(self, mock_client):
        """Test failed connection to Bluesky API."""
        # Setup mock to raise exception
        mock_client_instance = MagicMock()
        mock_client.return_value = mock_client_instance
        mock_client_instance.login.side_effect = Exception("Login failed")
        
        # Test
        api = BlueskyAPI(username="test_user", password="test_pass")
        result = api.connect()
        
        # Assertions
        assert result is False
        mock_client.assert_called_once()
        mock_client_instance.login.assert_called_once_with("test_user", "test_pass")

    @patch("app.api.bluesky.Client")
    def test_connect_already_connected(self, mock_client):
        """Test connection when already connected."""
        # Setup
        api = BlueskyAPI(username="test_user", password="test_pass")
        api.client = MagicMock()  # Simulate already connected
        
        # Test
        result = api.connect()
        
        # Assertions
        assert result is True
        mock_client.assert_not_called()  # Should not create a new client

    @patch("app.api.bluesky.BlueskyAPI.connect")
    def test_fetch_posts_connection_failure(self, mock_connect):
        """Test fetch_posts when connection fails."""
        # Setup mock
        mock_connect.return_value = False
        
        # Test
        api = BlueskyAPI()
        with pytest.raises(Exception, match="Failed to connect to Bluesky API"):
            api.fetch_posts(["AAPL"])
        
        # Assertions
        mock_connect.assert_called_once()

    @patch("app.api.bluesky.BlueskyAPI.connect")
    def test_fetch_posts_success(self, mock_connect):
        """Test successful fetch_posts with mocked client."""
        # Setup mocks
        mock_connect.return_value = True
        api = BlueskyAPI()
        api.client = MagicMock()
        
        # Mock the search_posts method
        mock_post1 = {"uri": "post1", "record": {"text": "Post about $AAPL"}}
        mock_post2 = {"uri": "post2", "record": {"text": "Another $AAPL post"}}
        api.client.search_posts.return_value = {"posts": [mock_post1, mock_post2]}
        
        # Mock the get_post_thread method
        api.client.get_post_thread.return_value = {
            "thread": {
                "post": {
                    "author": {"handle": "user1"},
                    "record": {"text": "Post about $AAPL"},
                    "likeCount": 5,
                    "repostCount": 2
                }
            }
        }
        
        # Test
        result = api.fetch_posts(["AAPL"], limit=2)
        
        # Assertions
        assert len(result) <= 2  # Should respect the limit
        mock_connect.assert_called_once()
        api.client.search_posts.assert_called()

    def test_get_user_info(self):
        """Test get_user_info method."""
        # Setup
        api = BlueskyAPI()
        api.client = MagicMock()
        mock_profile = {
            "handle": "test_user",
            "displayName": "Test User",
            "description": "Test bio",
            "followersCount": 100,
            "followsCount": 50
        }
        api.client.get_profile.return_value = mock_profile
        
        # Test
        result = api.get_user_info("test_user")
        
        # Assertions
        assert result == mock_profile
        api.client.get_profile.assert_called_once_with({"actor": "test_user"})

    def test_get_user_info_connection_failure(self):
        """Test get_user_info when not connected."""
        # Setup
        api = BlueskyAPI()
        api.client = None
        
        # Test
        with pytest.raises(Exception, match="Not connected to Bluesky API"):
            api.get_user_info("test_user")

    def test_get_trending_topics(self):
        """Test get_trending_topics method."""
        # Setup
        api = BlueskyAPI()
        api.client = MagicMock()
        
        # Mock popular feed generator
        mock_feed = [
            {"post": {"record": {"text": "Post about $AAPL"}}},
            {"post": {"record": {"text": "Post about $MSFT"}}},
            {"post": {"record": {"text": "Another $AAPL post"}}},
            {"post": {"record": {"text": "Post about $GOOGL"}}}
        ]
        api.client.get_timeline.return_value = {"feed": mock_feed}
        
        # Test
        result = api.get_trending_topics()
        
        # Assertions
        assert isinstance(result, dict)
        assert "AAPL" in result
        assert result["AAPL"] == 2  # Should count AAPL twice
        assert "MSFT" in result
        assert "GOOGL" in result
        api.client.get_timeline.assert_called_once() 