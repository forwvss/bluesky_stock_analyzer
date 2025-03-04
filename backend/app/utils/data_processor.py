import re
import logging
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
import json
from datetime import datetime

class DataProcessor:
    """Class for processing and cleaning text data from Bluesky."""
    
    def __init__(self):
        """Initialize the data processor."""
        self.logger = logging.getLogger(__name__)
        
        # Ensure NLTK resources are available
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')
        
        self.stop_words = set(stopwords.words('english'))
    
    def preprocess(self, data_list):
        """Preprocess a list of data items.
        
        Args:
            data_list (list): List of dictionaries containing text data
            
        Returns:
            list: List of preprocessed data items
        """
        processed_data = []
        
        for item in data_list:
            # Skip items without text
            if 'text' not in item or not item['text']:
                continue
            
            # Clean the text
            cleaned_text = self.clean_text(item['text'])
            
            # Skip if text is too short after cleaning
            if len(cleaned_text.split()) < 3:
                continue
            
            # Create a new item with cleaned text
            processed_item = item.copy()
            processed_item['original_text'] = item['text']
            processed_item['text'] = cleaned_text
            processed_item['tokens'] = self.tokenize(cleaned_text)
            
            # Add timestamp for easier sorting
            if 'created_at' in processed_item:
                try:
                    dt = datetime.fromisoformat(processed_item['created_at'].replace('Z', '+00:00'))
                    processed_item['timestamp'] = dt.timestamp()
                except Exception as e:
                    self.logger.error(f"Error parsing date: {str(e)}")
            
            processed_data.append(processed_item)
        
        return processed_data
    
    def clean_text(self, text):
        """Clean text by removing URLs, mentions, special characters, etc.
        
        Args:
            text (str): Text to clean
            
        Returns:
            str: Cleaned text
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        
        # Remove mentions (@username)
        text = re.sub(r'@\w+', '', text)
        
        # Remove hashtags
        text = re.sub(r'#\w+', '', text)
        
        # Remove emojis (simple approach)
        text = re.sub(r'[^\x00-\x7F]+', '', text)
        
        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize(self, text):
        """Tokenize text and remove stop words.
        
        Args:
            text (str): Text to tokenize
            
        Returns:
            list: List of tokens
        """
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stop words
        tokens = [word for word in tokens if word.lower() not in self.stop_words]
        
        return tokens
    
    def save_to_csv(self, data_list, filename):
        """Save data to a CSV file.
        
        Args:
            data_list (list): List of data items
            filename (str): Output filename
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Convert to DataFrame
            df = pd.DataFrame(data_list)
            
            # Save to CSV
            df.to_csv(filename, index=False)
            
            self.logger.info(f"Saved {len(data_list)} items to {filename}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving to CSV: {str(e)}")
            return False
    
    def save_to_json(self, data_list, filename):
        """Save data to a JSON file.
        
        Args:
            data_list (list): List of data items
            filename (str): Output filename
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Save to JSON
            with open(filename, 'w') as f:
                json.dump(data_list, f, indent=2)
            
            self.logger.info(f"Saved {len(data_list)} items to {filename}")
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving to JSON: {str(e)}")
            return False
    
    def load_from_json(self, filename):
        """Load data from a JSON file.
        
        Args:
            filename (str): Input filename
            
        Returns:
            list: List of data items
        """
        try:
            # Load from JSON
            with open(filename, 'r') as f:
                data = json.load(f)
            
            self.logger.info(f"Loaded {len(data)} items from {filename}")
            return data
            
        except Exception as e:
            self.logger.error(f"Error loading from JSON: {str(e)}")
            return []
    
    def filter_by_keywords(self, data_list, keywords):
        """Filter data by keywords.
        
        Args:
            data_list (list): List of data items
            keywords (list): List of keywords to filter by
            
        Returns:
            list: Filtered list of data items
        """
        filtered_data = []
        
        for item in data_list:
            if 'text' not in item:
                continue
            
            text = item['text'].lower()
            
            # Check if any keyword is in the text
            if any(keyword.lower() in text for keyword in keywords):
                filtered_data.append(item)
        
        return filtered_data
    
    def group_by_date(self, data_list):
        """Group data by date.
        
        Args:
            data_list (list): List of data items
            
        Returns:
            dict: Dictionary with dates as keys and lists of data items as values
        """
        grouped_data = {}
        
        for item in data_list:
            if 'created_at' not in item:
                continue
            
            try:
                dt = datetime.fromisoformat(item['created_at'].replace('Z', '+00:00'))
                date_str = dt.strftime('%Y-%m-%d')
                
                if date_str not in grouped_data:
                    grouped_data[date_str] = []
                
                grouped_data[date_str].append(item)
                
            except Exception as e:
                self.logger.error(f"Error parsing date: {str(e)}")
        
        return grouped_data 