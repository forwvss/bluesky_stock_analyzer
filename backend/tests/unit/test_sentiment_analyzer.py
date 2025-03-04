"""Unit tests for the SentimentAnalyzer class."""

import pytest
from unittest.mock import patch, MagicMock
import numpy as np

from app.models.sentiment import SentimentAnalyzer


class TestSentimentAnalyzer:
    """Tests for the SentimentAnalyzer class."""

    def test_init_default(self):
        """Test initialization with default parameters."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        assert 'vader' in analyzer.methods
        assert 'textblob' in analyzer.methods
        assert 'transformer' not in analyzer.methods
        assert analyzer.vader is not None
        assert analyzer.transformer is None

    @patch("app.models.sentiment.pipeline")
    def test_init_with_transformers(self, mock_pipeline):
        """Test initialization with transformers enabled."""
        # Setup mock
        mock_pipeline.return_value = "mock_transformer"
        
        # Test
        analyzer = SentimentAnalyzer(use_transformers=True)
        
        # Assertions
        assert 'vader' in analyzer.methods
        assert 'textblob' in analyzer.methods
        assert 'transformer' in analyzer.methods
        assert analyzer.vader is not None
        assert analyzer.transformer == "mock_transformer"
        mock_pipeline.assert_called_once()

    @patch("app.models.sentiment.pipeline")
    def test_init_transformers_failure(self, mock_pipeline):
        """Test initialization when transformers fails to load."""
        # Setup mock to raise exception
        mock_pipeline.side_effect = Exception("Failed to load model")
        
        # Test
        analyzer = SentimentAnalyzer(use_transformers=True)
        
        # Assertions
        assert 'vader' in analyzer.methods
        assert 'textblob' in analyzer.methods
        assert 'transformer' not in analyzer.methods
        assert analyzer.vader is not None
        assert analyzer.transformer is None
        mock_pipeline.assert_called_once()

    def test_analyze_text_empty(self):
        """Test analyze_text with empty text."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        result = analyzer.analyze_text("")
        
        # Assertions
        assert result is not None
        assert 'vader' in result
        assert 'textblob' in result
        assert 'consensus' in result

    def test_analyze_text_positive(self):
        """Test analyze_text with positive text."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        text = "I love this product! It's amazing and innovative."
        result = analyzer.analyze_text(text)
        
        # Assertions
        assert result is not None
        assert 'vader' in result
        assert 'textblob' in result
        assert 'consensus' in result
        assert result['vader']['compound'] > 0  # Positive sentiment
        assert result['textblob']['polarity'] > 0  # Positive sentiment
        assert result['consensus'] == 'positive'

    def test_analyze_text_negative(self):
        """Test analyze_text with negative text."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        text = "This is terrible. I hate it and would never recommend it."
        result = analyzer.analyze_text(text)
        
        # Assertions
        assert result is not None
        assert 'vader' in result
        assert 'textblob' in result
        assert 'consensus' in result
        assert result['vader']['compound'] < 0  # Negative sentiment
        assert result['textblob']['polarity'] < 0  # Negative sentiment
        assert result['consensus'] == 'negative'

    def test_analyze_text_neutral(self):
        """Test analyze_text with neutral text."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        text = "This is a factual statement about the product."
        result = analyzer.analyze_text(text)
        
        # Assertions
        assert result is not None
        assert 'vader' in result
        assert 'textblob' in result
        assert 'consensus' in result
        # Neutral sentiment is harder to test precisely, but should be close to 0
        assert abs(result['vader']['compound']) < 0.5
        assert abs(result['textblob']['polarity']) < 0.5

    @patch("app.models.sentiment.SentimentAnalyzer.analyze_text")
    def test_analyze_batch(self, mock_analyze_text):
        """Test analyze_batch method."""
        # Setup mock
        mock_analyze_text.return_value = {
            'vader': {'compound': 0.5},
            'textblob': {'polarity': 0.5},
            'consensus': 'positive'
        }
        
        # Test data
        data = [
            {'id': 'post1', 'text': 'Text 1'},
            {'id': 'post2', 'text': 'Text 2'},
            {'id': 'post3', 'text': 'Text 3'}
        ]
        
        # Test
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = analyzer.analyze_batch(data)
        
        # Assertions
        assert len(results) == 3
        assert results[0]['id'] == 'post1'
        assert results[1]['id'] == 'post2'
        assert results[2]['id'] == 'post3'
        assert 'sentiment' in results[0]
        assert 'sentiment' in results[1]
        assert 'sentiment' in results[2]
        assert mock_analyze_text.call_count == 3

    def test_calculate_consensus_positive(self):
        """Test _calculate_consensus with positive sentiment."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = {
            'vader': {'compound': 0.8},
            'textblob': {'polarity': 0.7}
        }
        
        consensus = analyzer._calculate_consensus(results)
        assert consensus == 'positive'

    def test_calculate_consensus_negative(self):
        """Test _calculate_consensus with negative sentiment."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = {
            'vader': {'compound': -0.8},
            'textblob': {'polarity': -0.7}
        }
        
        consensus = analyzer._calculate_consensus(results)
        assert consensus == 'negative'

    def test_calculate_consensus_neutral(self):
        """Test _calculate_consensus with neutral sentiment."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = {
            'vader': {'compound': 0.1},
            'textblob': {'polarity': -0.1}
        }
        
        consensus = analyzer._calculate_consensus(results)
        assert consensus == 'neutral'

    def test_calculate_consensus_mixed(self):
        """Test _calculate_consensus with mixed sentiment."""
        analyzer = SentimentAnalyzer(use_transformers=False)
        results = {
            'vader': {'compound': 0.8},
            'textblob': {'polarity': -0.7}
        }
        
        consensus = analyzer._calculate_consensus(results)
        # The result could be any of the three, depending on the implementation
        assert consensus in ['positive', 'negative', 'neutral']

    @patch("app.models.sentiment.SentimentIntensityAnalyzer")
    def test_vader_failure(self, mock_vader):
        """Test behavior when VADER fails."""
        # Setup mock to raise exception
        mock_vader.side_effect = Exception("VADER failed")
        
        # Test
        analyzer = SentimentAnalyzer(use_transformers=False)
        assert analyzer.vader is None
        
        # Test analyze_text with VADER failure
        result = analyzer.analyze_text("Test text")
        assert 'vader' not in result
        assert 'textblob' in result
        assert 'consensus' in result

    @patch("app.models.sentiment.TextBlob")
    def test_textblob_failure(self, mock_textblob):
        """Test behavior when TextBlob fails."""
        # Setup mock to raise exception
        mock_textblob.side_effect = Exception("TextBlob failed")
        
        # Test
        analyzer = SentimentAnalyzer(use_transformers=False)
        
        # Test analyze_text with TextBlob failure
        with patch.object(analyzer, 'vader') as mock_vader:
            mock_vader.polarity_scores.return_value = {'compound': 0.5, 'neg': 0.1, 'neu': 0.4, 'pos': 0.5}
            result = analyzer.analyze_text("Test text")
            assert 'vader' in result
            assert 'textblob' not in result
            assert 'consensus' in result 