"""Integration tests for the interaction between DataProcessor and SentimentAnalyzer."""

import pytest
from datetime import datetime

from app.utils.data_processor import DataProcessor
from app.models.sentiment import SentimentAnalyzer


class TestProcessorSentimentIntegration:
    """Integration tests for DataProcessor and SentimentAnalyzer."""

    def test_preprocess_and_analyze(self):
        """Test preprocessing data and then analyzing sentiment."""
        # Initialize components
        processor = DataProcessor()
        analyzer = SentimentAnalyzer(use_transformers=False)
        
        # Sample data
        data = [
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
        
        # Preprocess data
        processed_data = processor.preprocess(data)
        
        # Analyze sentiment
        results = analyzer.analyze_batch(processed_data)
        
        # Assertions
        assert len(results) == 3
        
        # Check first post (positive sentiment)
        assert results[0]["id"] == "post1"
        assert "sentiment" in results[0]
        assert results[0]["sentiment"]["consensus"] == "positive"
        assert "stock_symbols" in results[0]
        assert "AAPL" in results[0]["stock_symbols"]
        
        # Check second post (negative sentiment)
        assert results[1]["id"] == "post2"
        assert "sentiment" in results[1]
        assert results[1]["sentiment"]["consensus"] == "negative"
        assert "stock_symbols" in results[1]
        assert "MSFT" in results[1]["stock_symbols"]
        
        # Check third post (neutral sentiment)
        assert results[2]["id"] == "post3"
        assert "sentiment" in results[2]
        assert results[2]["sentiment"]["consensus"] == "neutral"
        assert "stock_symbols" in results[2]
        assert "GOOGL" in results[2]["stock_symbols"]

    def test_filter_and_analyze(self):
        """Test filtering data by keywords and then analyzing sentiment."""
        # Initialize components
        processor = DataProcessor()
        analyzer = SentimentAnalyzer(use_transformers=False)
        
        # Sample data
        data = [
            {
                "id": "post1",
                "text": "I really love the new $AAPL product! It's amazing and innovative.",
                "user": "user1",
                "timestamp": datetime.now().isoformat(),
                "likes": 10,
                "reposts": 5,
                "stock_symbols": ["AAPL"]
            },
            {
                "id": "post2",
                "text": "The $MSFT earnings report was disappointing. Stock might drop.",
                "user": "user2",
                "timestamp": datetime.now().isoformat(),
                "likes": 3,
                "reposts": 1,
                "stock_symbols": ["MSFT"]
            },
            {
                "id": "post3",
                "text": "Neutral thoughts about $GOOGL, not sure where it's headed.",
                "user": "user3",
                "timestamp": datetime.now().isoformat(),
                "likes": 5,
                "reposts": 2,
                "stock_symbols": ["GOOGL"]
            }
        ]
        
        # Filter data by keywords
        filtered_data = processor.filter_by_keywords(data, ["AAPL", "GOOGL"])
        
        # Analyze sentiment
        results = analyzer.analyze_batch(filtered_data)
        
        # Assertions
        assert len(results) == 2  # Should only include AAPL and GOOGL posts
        
        # Check first post (positive sentiment about AAPL)
        assert results[0]["id"] == "post1"
        assert "sentiment" in results[0]
        assert "stock_symbols" in results[0]
        assert "AAPL" in results[0]["stock_symbols"]
        
        # Check second post (neutral sentiment about GOOGL)
        assert results[1]["id"] == "post3"
        assert "sentiment" in results[1]
        assert "stock_symbols" in results[1]
        assert "GOOGL" in results[1]["stock_symbols"]

    def test_group_by_date_and_analyze(self):
        """Test grouping data by date and then analyzing sentiment."""
        # Initialize components
        processor = DataProcessor()
        analyzer = SentimentAnalyzer(use_transformers=False)
        
        # Sample data with different dates
        today = datetime.now()
        yesterday = datetime.now().replace(day=datetime.now().day-1)
        
        data = [
            {
                "id": "post1",
                "text": "I really love the new $AAPL product! It's amazing and innovative.",
                "user": "user1",
                "timestamp": today.isoformat(),
                "likes": 10,
                "reposts": 5,
                "stock_symbols": ["AAPL"]
            },
            {
                "id": "post2",
                "text": "The $MSFT earnings report was disappointing. Stock might drop.",
                "user": "user2",
                "timestamp": today.isoformat(),
                "likes": 3,
                "reposts": 1,
                "stock_symbols": ["MSFT"]
            },
            {
                "id": "post3",
                "text": "Neutral thoughts about $GOOGL, not sure where it's headed.",
                "user": "user3",
                "timestamp": yesterday.isoformat(),
                "likes": 5,
                "reposts": 2,
                "stock_symbols": ["GOOGL"]
            }
        ]
        
        # Group data by date
        grouped_data = processor.group_by_date(data)
        
        # Analyze sentiment for each date group
        results = {}
        for date, posts in grouped_data.items():
            results[date] = analyzer.analyze_batch(posts)
        
        # Assertions
        assert len(results) == 2  # Two different dates
        
        today_str = today.strftime("%Y-%m-%d")
        yesterday_str = yesterday.strftime("%Y-%m-%d")
        
        assert today_str in results
        assert yesterday_str in results
        
        # Check today's posts
        assert len(results[today_str]) == 2
        assert results[today_str][0]["id"] == "post1"
        assert results[today_str][1]["id"] == "post2"
        
        # Check yesterday's posts
        assert len(results[yesterday_str]) == 1
        assert results[yesterday_str][0]["id"] == "post3"

    def test_empty_data_handling(self):
        """Test handling of empty data in the processing and analysis pipeline."""
        # Initialize components
        processor = DataProcessor()
        analyzer = SentimentAnalyzer(use_transformers=False)
        
        # Test with empty data
        data = []
        
        # Process empty data
        processed_data = processor.preprocess(data)
        assert processed_data == []
        
        # Analyze empty data
        results = analyzer.analyze_batch(processed_data)
        assert results == []
        
        # Filter empty data
        filtered_data = processor.filter_by_keywords(data, ["AAPL"])
        assert filtered_data == []
        
        # Group empty data by date
        grouped_data = processor.group_by_date(data)
        assert grouped_data == {} 