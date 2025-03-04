"""Unit tests for the DataProcessor class."""

import pytest
import os
import json
import pandas as pd
from unittest.mock import patch, mock_open, MagicMock
from datetime import datetime

from app.utils.data_processor import DataProcessor


class TestDataProcessor:
    """Tests for the DataProcessor class."""

    def test_init(self):
        """Test initialization of DataProcessor."""
        processor = DataProcessor()
        assert hasattr(processor, 'stop_words')
        assert processor.stop_words is not None
        assert len(processor.stop_words) > 0

    def test_clean_text(self):
        """Test clean_text method."""
        processor = DataProcessor()
        
        # Test with various text inputs
        assert processor.clean_text("") == ""
        assert processor.clean_text("Hello, world!") == "hello world"
        assert processor.clean_text("$AAPL is great!") == "$aapl is great"
        assert processor.clean_text("RT @user: This is a retweet") == "this is a retweet"
        assert processor.clean_text("Check out https://example.com") == "check out"
        assert processor.clean_text("#hashtag test") == "hashtag test"
        
        # Test with special characters and emojis
        assert processor.clean_text("Test with emoji 😊") == "test with emoji"
        assert processor.clean_text("Test with special chars: @#$%^&*()") == "test with special chars"

    def test_tokenize(self):
        """Test tokenize method."""
        processor = DataProcessor()
        
        # Test with various text inputs
        assert processor.tokenize("") == []
        
        tokens = processor.tokenize("This is a test")
        assert isinstance(tokens, list)
        assert len(tokens) > 0
        assert "this" in tokens
        assert "is" in tokens
        assert "a" in tokens
        assert "test" in tokens
        
        # Test with stop words removal
        tokens = processor.tokenize("This is a test with the and of stopwords")
        assert "the" not in tokens
        assert "and" not in tokens
        assert "of" not in tokens
        assert "test" in tokens
        assert "stopwords" in tokens

    def test_preprocess_empty_list(self):
        """Test preprocess with empty list."""
        processor = DataProcessor()
        result = processor.preprocess([])
        assert result == []

    def test_preprocess(self):
        """Test preprocess method."""
        processor = DataProcessor()
        
        # Test data
        data = [
            {"id": "post1", "text": "This is a test post about $AAPL"},
            {"id": "post2", "text": "Another post about $MSFT and $GOOGL"},
            {"id": "post3", "text": ""}  # Empty text should be skipped
        ]
        
        result = processor.preprocess(data)
        
        # Assertions
        assert len(result) == 2  # Empty text should be skipped
        assert result[0]["id"] == "post1"
        assert "cleaned_text" in result[0]
        assert "tokens" in result[0]
        assert "$aapl" in result[0]["cleaned_text"]
        assert "stock_symbols" in result[0]
        assert "AAPL" in result[0]["stock_symbols"]
        
        assert result[1]["id"] == "post2"
        assert "cleaned_text" in result[1]
        assert "tokens" in result[1]
        assert "stock_symbols" in result[1]
        assert "MSFT" in result[1]["stock_symbols"]
        assert "GOOGL" in result[1]["stock_symbols"]

    @patch("app.utils.data_processor.pd.DataFrame.to_csv")
    def test_save_to_csv(self, mock_to_csv):
        """Test save_to_csv method."""
        processor = DataProcessor()
        
        # Test data
        data = [
            {"id": "post1", "text": "Test post 1", "user": "user1"},
            {"id": "post2", "text": "Test post 2", "user": "user2"}
        ]
        
        # Test
        processor.save_to_csv(data, "test_output.csv")
        
        # Assertions
        mock_to_csv.assert_called_once()
        args, kwargs = mock_to_csv.call_args
        assert kwargs["index"] is False

    @patch("builtins.open", new_callable=mock_open)
    @patch("json.dump")
    def test_save_to_json(self, mock_json_dump, mock_file_open):
        """Test save_to_json method."""
        processor = DataProcessor()
        
        # Test data
        data = [
            {"id": "post1", "text": "Test post 1", "user": "user1"},
            {"id": "post2", "text": "Test post 2", "user": "user2"}
        ]
        
        # Test
        processor.save_to_json(data, "test_output.json")
        
        # Assertions
        mock_file_open.assert_called_once_with("test_output.json", "w")
        mock_json_dump.assert_called_once()
        args, kwargs = mock_json_dump.call_args
        assert args[0] == data

    @patch("builtins.open", new_callable=mock_open, read_data='[{"id": "post1", "text": "Test"}]')
    @patch("json.load")
    def test_load_from_json(self, mock_json_load, mock_file_open):
        """Test load_from_json method."""
        processor = DataProcessor()
        
        # Mock data
        mock_data = [{"id": "post1", "text": "Test"}]
        mock_json_load.return_value = mock_data
        
        # Test
        result = processor.load_from_json("test_input.json")
        
        # Assertions
        mock_file_open.assert_called_once_with("test_input.json", "r")
        mock_json_load.assert_called_once()
        assert result == mock_data

    def test_filter_by_keywords_empty(self):
        """Test filter_by_keywords with empty inputs."""
        processor = DataProcessor()
        
        # Test with empty data
        assert processor.filter_by_keywords([], ["AAPL"]) == []
        
        # Test with empty keywords
        data = [{"id": "post1", "text": "Test post"}]
        assert processor.filter_by_keywords(data, []) == data

    def test_filter_by_keywords(self):
        """Test filter_by_keywords method."""
        processor = DataProcessor()
        
        # Test data
        data = [
            {"id": "post1", "text": "Post about AAPL", "stock_symbols": ["AAPL"]},
            {"id": "post2", "text": "Post about MSFT", "stock_symbols": ["MSFT"]},
            {"id": "post3", "text": "Post about AAPL and GOOGL", "stock_symbols": ["AAPL", "GOOGL"]}
        ]
        
        # Test with single keyword
        result = processor.filter_by_keywords(data, ["AAPL"])
        assert len(result) == 2
        assert result[0]["id"] == "post1"
        assert result[1]["id"] == "post3"
        
        # Test with multiple keywords
        result = processor.filter_by_keywords(data, ["AAPL", "MSFT"])
        assert len(result) == 3
        
        # Test with non-matching keyword
        result = processor.filter_by_keywords(data, ["AMZN"])
        assert len(result) == 0

    def test_group_by_date(self):
        """Test group_by_date method."""
        processor = DataProcessor()
        
        # Test data with timestamps
        now = datetime.now()
        yesterday = datetime.now().replace(day=datetime.now().day-1)
        
        data = [
            {"id": "post1", "timestamp": now.isoformat(), "text": "Post 1"},
            {"id": "post2", "timestamp": now.isoformat(), "text": "Post 2"},
            {"id": "post3", "timestamp": yesterday.isoformat(), "text": "Post 3"}
        ]
        
        result = processor.group_by_date(data)
        
        # Assertions
        assert isinstance(result, dict)
        assert len(result) == 2  # Two different dates
        
        today_str = now.strftime("%Y-%m-%d")
        yesterday_str = yesterday.strftime("%Y-%m-%d")
        
        assert today_str in result
        assert yesterday_str in result
        assert len(result[today_str]) == 2
        assert len(result[yesterday_str]) == 1

    def test_group_by_date_invalid_timestamp(self):
        """Test group_by_date with invalid timestamp format."""
        processor = DataProcessor()
        
        # Test data with invalid timestamp
        data = [
            {"id": "post1", "timestamp": "invalid-date", "text": "Post 1"}
        ]
        
        result = processor.group_by_date(data)
        
        # Assertions
        assert isinstance(result, dict)
        assert len(result) == 0  # No valid dates 