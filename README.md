# Bluesky Stock Analyzer

A web application that analyzes stock market trends using social media data from Bluesky.

## Project Overview

This project aims to analyze stock market trends by processing and analyzing social media data from Bluesky. The application is divided into two main stages:

### Stage 1: Data Collection and Sentiment Analysis
- Fetch data from Bluesky API
- Clean and preprocess the data
- Perform sentiment analysis using pre-trained models
- Store processed data for further analysis

### Stage 2: Stock Market Trend Analysis
- Analyze sentiment data to identify trends
- Correlate sentiment with stock market movements
- Visualize insights through interactive dashboards
- Potentially implement predictive models

## Setup and Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/bluesky_stock_analyzer.git
cd bluesky_stock_analyzer
```

2. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
BLUESKY_USERNAME=your_bluesky_username
BLUESKY_PASSWORD=your_bluesky_password
```

5. Run the application:
```
flask run
```

## Project Structure

```
bluesky_stock_analyzer/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   └── bluesky.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── sentiment.py
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── main.js
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   └── dashboard.html
│   ├── utils/
│   │   ├── __init__.py
│   │   └── data_processor.py
│   ├── __init__.py
│   ├── config.py
│   └── routes.py
├── data/
├── tests/
│   ├── conftest.py
│   ├── __init__.py
│   ├── README.md
│   ├── unit/
│   │   ├── __init__.py
│   │   ├── test_bluesky_api.py
│   │   ├── test_data_processor.py
│   │   └── test_sentiment_analyzer.py
│   ├── integration/
│   │   ├── __init__.py
│   │   ├── test_api_sentiment.py
│   │   └── test_processor_sentiment.py
│   └── functional/
│       ├── __init__.py
│       ├── test_app.py
│       └── test_routes.py
├── .env
├── .gitignore
├── requirements.txt
├── README.md
└── run.py
```

## Features

- Bluesky API integration
- Data preprocessing and cleaning
- Sentiment analysis using multiple models
- Interactive data visualization
- Stock market trend analysis
- User-friendly web interface

## Testing

The project includes a comprehensive test suite covering unit, integration, and functional tests.

### Running Tests

To run all tests:

```bash
pytest
```

To run tests with coverage:

```bash
pytest --cov=app tests/
```

To generate a coverage report:

```bash
pytest --cov=app --cov-report=html tests/
```

### Test Categories

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test interactions between components
- **Functional Tests**: Test the application as a whole

For more details about testing, see the [tests/README.md](tests/README.md) file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Bluesky API
- NLTK, TextBlob, and VADER for sentiment analysis
- Flask web framework
- Plotly and Matplotlib for data visualization
- Pytest for testing 