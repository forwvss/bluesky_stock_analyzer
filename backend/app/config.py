import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_key')
    FLASK_APP = os.environ.get('FLASK_APP', 'run.py')
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    
    # Bluesky API credentials
    BLUESKY_USERNAME = os.environ.get('BLUESKY_USERNAME', '')
    BLUESKY_PASSWORD = os.environ.get('BLUESKY_PASSWORD', '')
    
    # Database settings
    DATABASE_URI = os.environ.get('DATABASE_URI', 'sqlite:///data/bluesky_data.db')
    
    # Data storage paths
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    
    # Sentiment analysis settings
    USE_TRANSFORMERS = True
    
    # Stock market API settings (for future use)
    STOCK_API_KEY = os.environ.get('STOCK_API_KEY', '')
    
    # Logging settings
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs', 'app.log')

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = False
    TESTING = True
    DATABASE_URI = 'sqlite:///:memory:'
    USE_TRANSFORMERS = False  # Disable transformers for faster testing

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    
    # Use a more secure secret key in production
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Set stricter security headers
    SECURITY_HEADERS = {
        'Content-Security-Policy': "default-src 'self'",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
    }

# Dictionary of configurations
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

# Get the current configuration
def get_config():
    """Get the current configuration based on FLASK_ENV."""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default']) 