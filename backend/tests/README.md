# Bluesky Stock Analyzer Tests

This directory contains tests for the Bluesky Stock Analyzer application. The tests are organized into three categories:

1. **Unit Tests**: Tests for individual components in isolation
2. **Integration Tests**: Tests for the interaction between components
3. **Functional Tests**: Tests for the application as a whole

## Test Structure

```
tests/
├── conftest.py           # Common fixtures for all tests
├── __init__.py           # Package initialization
├── unit/                 # Unit tests
│   ├── __init__.py
│   ├── test_bluesky_api.py
│   ├── test_data_processor.py
│   └── test_sentiment_analyzer.py
├── integration/          # Integration tests
│   ├── __init__.py
│   ├── test_api_sentiment.py
│   └── test_processor_sentiment.py
└── functional/           # Functional tests
    ├── __init__.py
    ├── test_app.py
    └── test_routes.py
```

## Running Tests

To run all tests:

```bash
pytest
```

To run a specific test category:

```bash
pytest tests/unit/
pytest tests/integration/
pytest tests/functional/
```

To run a specific test file:

```bash
pytest tests/unit/test_bluesky_api.py
```

To run a specific test:

```bash
pytest tests/unit/test_bluesky_api.py::TestBlueskyAPI::test_init_with_credentials
```

## Test Coverage

To run tests with coverage:

```bash
pytest --cov=app tests/
```

To generate a coverage report:

```bash
pytest --cov=app --cov-report=html tests/
```

This will create a `htmlcov` directory with an HTML report of the test coverage.

## Fixtures

Common fixtures are defined in `conftest.py`. These include:

- `app`: A Flask application instance for testing
- `client`: A test client for the Flask application
- `runner`: A test CLI runner for the Flask application
- `sample_posts`: Sample post data for testing
- `sample_sentiment_results`: Sample sentiment analysis results for testing
- `mock_bluesky_api`: A mock BlueskyAPI instance for testing
- `data_processor`: A DataProcessor instance for testing
- `sentiment_analyzer`: A SentimentAnalyzer instance for testing

## Mocking

The tests use the `unittest.mock` module to mock external dependencies, such as the Bluesky API client. This allows the tests to run without requiring actual API credentials or network access.

## Test Categories

### Unit Tests

Unit tests focus on testing individual components in isolation. They use mocks to replace dependencies and focus on testing the component's behavior.

### Integration Tests

Integration tests focus on testing the interaction between components. They test how components work together and ensure that they integrate correctly.

### Functional Tests

Functional tests focus on testing the application as a whole. They test the application's behavior from the user's perspective and ensure that the application works as expected. 