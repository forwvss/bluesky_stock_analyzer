import os
import time
import logging
from atproto import Client
from datetime import datetime, timedelta

class BlueskyAPI:
    """Class to interact with the Bluesky API."""
    
    def __init__(self, username=None, password=None):
        """Initialize the Bluesky API client.
        
        Args:
            username (str): Bluesky username or email
            password (str): Bluesky password
        """
        self.username = username or os.environ.get('BLUESKY_USERNAME')
        self.password = password or os.environ.get('BLUESKY_PASSWORD')
        self.client = None
        self.logger = logging.getLogger(__name__)
        
        if not self.username or not self.password:
            self.logger.warning("Bluesky credentials not provided. Some functionality may be limited.")
    
    def connect(self):
        """Connect to the Bluesky API."""
        if not self.client:
            try:
                self.client = Client()
                self.client.login(self.username, self.password)
                self.logger.info("Successfully connected to Bluesky API")
                return True
            except Exception as e:
                self.logger.error(f"Failed to connect to Bluesky API: {str(e)}")
                return False
        return True
    
    def fetch_posts(self, keywords, limit=100, days_back=7):
        """Fetch posts from Bluesky based on keywords.
        
        Args:
            keywords (list): List of keywords to search for
            limit (int): Maximum number of posts to fetch
            days_back (int): Number of days to look back
            
        Returns:
            list: List of posts matching the keywords
        """
        if not self.connect():
            raise Exception("Failed to connect to Bluesky API")
        
        results = []
        
        for keyword in keywords:
            self.logger.info(f"Searching for posts with keyword: {keyword}")
            
            try:
                # Search for posts with the keyword
                search_results = self.client.app.bsky.feed.searchPosts({
                    'q': keyword.strip(),
                    'limit': limit
                })
                
                # Process search results
                if hasattr(search_results, 'posts'):
                    for post in search_results.posts:
                        # Check if post is within the time range
                        created_at = datetime.fromisoformat(post.indexedAt.replace('Z', '+00:00'))
                        if created_at > datetime.now(created_at.tzinfo) - timedelta(days=days_back):
                            # Extract relevant information
                            post_data = {
                                'id': post.uri,
                                'text': post.record.text if hasattr(post.record, 'text') else '',
                                'author': post.author.handle,
                                'created_at': post.indexedAt,
                                'likes': getattr(post, 'likeCount', 0),
                                'replies': getattr(post, 'replyCount', 0),
                                'reposts': getattr(post, 'repostCount', 0),
                                'keyword': keyword
                            }
                            
                            results.append(post_data)
                
                # Respect rate limits
                time.sleep(1)
                
            except Exception as e:
                self.logger.error(f"Error fetching posts for keyword '{keyword}': {str(e)}")
        
        self.logger.info(f"Fetched {len(results)} posts in total")
        return results
    
    def get_user_info(self, username):
        """Get information about a Bluesky user.
        
        Args:
            username (str): Bluesky username
            
        Returns:
            dict: User information
        """
        if not self.connect():
            raise Exception("Failed to connect to Bluesky API")
        
        try:
            response = self.client.app.bsky.actor.getProfile({'actor': username})
            
            user_info = {
                'did': response.did,
                'handle': response.handle,
                'display_name': response.displayName if hasattr(response, 'displayName') else '',
                'description': response.description if hasattr(response, 'description') else '',
                'followers_count': response.followersCount if hasattr(response, 'followersCount') else 0,
                'following_count': response.followsCount if hasattr(response, 'followsCount') else 0,
                'posts_count': response.postsCount if hasattr(response, 'postsCount') else 0
            }
            
            return user_info
            
        except Exception as e:
            self.logger.error(f"Error fetching user info for '{username}': {str(e)}")
            return None
    
    def get_trending_topics(self):
        """Get trending topics on Bluesky.
        
        Returns:
            list: List of trending topics
        """
        if not self.connect():
            raise Exception("Failed to connect to Bluesky API")
        
        try:
            # Note: This is a placeholder as Bluesky API might not have a direct
            # endpoint for trending topics yet. This would need to be updated
            # when such functionality becomes available.
            self.logger.warning("Trending topics API not yet implemented in Bluesky")
            return []
            
        except Exception as e:
            self.logger.error(f"Error fetching trending topics: {str(e)}")
            return [] 