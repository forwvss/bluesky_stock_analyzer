import os
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS

# Load environment variables
load_dotenv()

def create_app(test_config=None):
    """Create and configure the Flask application."""
    app = Flask(__name__, instance_relative_config=True)
    
    # Enable CORS for all routes to allow React frontend to access the API
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Load configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
        DATABASE_URI=os.environ.get('DATABASE_URI', 'sqlite:///data/bluesky_data.db'),
        BLUESKY_USERNAME=os.environ.get('BLUESKY_USERNAME', ''),
        BLUESKY_PASSWORD=os.environ.get('BLUESKY_PASSWORD', '')
    )
    
    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Register blueprints
    from app.routes import main_bp
    app.register_blueprint(main_bp)
    
    # Register API blueprints
    from app.api.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Initialize NLTK
    import nltk
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')
    
    return app 