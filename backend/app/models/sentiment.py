import logging
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob
from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np

class SentimentAnalyzer:
    """Class for analyzing sentiment of text data."""
    
    def __init__(self, use_transformers=True):
        """Initialize the sentiment analyzer.
        
        Args:
            use_transformers (bool): Whether to use the Hugging Face transformers model
        """
        self.logger = logging.getLogger(__name__)
        self.methods = ['vader', 'textblob']
        
        # Initialize VADER
        try:
            self.vader = SentimentIntensityAnalyzer()
        except Exception as e:
            self.logger.error(f"Error initializing VADER: {str(e)}")
            self.vader = None
        
        # Initialize transformers if requested
        self.transformer = None
        if use_transformers:
            try:
                model_name = "finiteautomata/bertweet-base-sentiment-analysis"
                self.transformer = pipeline(
                    "sentiment-analysis",
                    model=model_name,
                    tokenizer=model_name,
                    return_all_scores=True
                )
                self.methods.append('transformer')
            except Exception as e:
                self.logger.error(f"Error initializing transformer model: {str(e)}")
    
    def analyze_text(self, text):
        """Analyze the sentiment of a text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            dict: Sentiment scores from different methods
        """
        results = {
            'text': text,
            'sentiment': {}
        }
        
        # VADER sentiment analysis
        if self.vader and 'vader' in self.methods:
            try:
                vader_scores = self.vader.polarity_scores(text)
                results['sentiment']['vader'] = {
                    'compound': vader_scores['compound'],
                    'positive': vader_scores['pos'],
                    'negative': vader_scores['neg'],
                    'neutral': vader_scores['neu'],
                    'label': 'positive' if vader_scores['compound'] >= 0.05 else 
                             'negative' if vader_scores['compound'] <= -0.05 else 'neutral'
                }
            except Exception as e:
                self.logger.error(f"Error in VADER analysis: {str(e)}")
        
        # TextBlob sentiment analysis
        if 'textblob' in self.methods:
            try:
                blob = TextBlob(text)
                polarity = blob.sentiment.polarity
                subjectivity = blob.sentiment.subjectivity
                
                results['sentiment']['textblob'] = {
                    'polarity': polarity,
                    'subjectivity': subjectivity,
                    'label': 'positive' if polarity > 0.1 else 
                             'negative' if polarity < -0.1 else 'neutral'
                }
            except Exception as e:
                self.logger.error(f"Error in TextBlob analysis: {str(e)}")
        
        # Transformer-based sentiment analysis
        if self.transformer and 'transformer' in self.methods:
            try:
                # Truncate text if it's too long
                max_length = 512
                if len(text) > max_length:
                    text = text[:max_length]
                
                transformer_scores = self.transformer(text)[0]
                
                # Convert to dictionary format
                scores_dict = {item['label']: item['score'] for item in transformer_scores}
                
                # Determine the label with the highest score
                max_label = max(scores_dict, key=scores_dict.get)
                
                results['sentiment']['transformer'] = {
                    'scores': scores_dict,
                    'label': max_label
                }
            except Exception as e:
                self.logger.error(f"Error in transformer analysis: {str(e)}")
        
        # Calculate consensus sentiment
        self._calculate_consensus(results)
        
        return results
    
    def _calculate_consensus(self, results):
        """Calculate consensus sentiment from different methods.
        
        Args:
            results (dict): Sentiment results from different methods
        """
        labels = []
        
        if 'vader' in results['sentiment']:
            labels.append(results['sentiment']['vader']['label'])
        
        if 'textblob' in results['sentiment']:
            labels.append(results['sentiment']['textblob']['label'])
        
        if 'transformer' in results['sentiment']:
            labels.append(results['sentiment']['transformer']['label'])
        
        if labels:
            # Count occurrences of each label
            label_counts = {}
            for label in labels:
                label_counts[label] = label_counts.get(label, 0) + 1
            
            # Find the most common label
            consensus_label = max(label_counts, key=label_counts.get)
            
            # Calculate confidence as the proportion of methods that agree
            confidence = label_counts[consensus_label] / len(labels)
            
            results['sentiment']['consensus'] = {
                'label': consensus_label,
                'confidence': confidence
            }
    
    def analyze_batch(self, data_list):
        """Analyze sentiment for a batch of texts.
        
        Args:
            data_list (list): List of dictionaries containing text data
            
        Returns:
            list: List of dictionaries with sentiment analysis results
        """
        results = []
        
        for item in data_list:
            # Extract text from the item
            text = item.get('text', '')
            
            if not text:
                continue
            
            # Analyze sentiment
            sentiment_results = self.analyze_text(text)
            
            # Combine original data with sentiment results
            result_item = item.copy()
            result_item['sentiment'] = sentiment_results['sentiment']
            
            results.append(result_item)
        
        return results 