import os
import logging
from app import create_app
from app.config import get_config

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    # Ensure the data directory exists
    os.makedirs('data', exist_ok=True)
    
    # Run the application
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000))) 