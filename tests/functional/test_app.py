"""Functional tests for the Flask application initialization."""

import pytest
import os
from unittest.mock import patch


class TestApp:
    """Tests for the Flask application initialization."""

    def test_app_creation(self, app):
        """Test that the app is created successfully."""
        assert app is not None
        assert app.config['TESTING'] is True
        assert app.config['SECRET_KEY'] == 'test_secret_key'
        assert app.config['DATABASE_URI'] == 'sqlite:///:memory:'
        assert app.config['BLUESKY_USERNAME'] == 'test_user'
        assert app.config['BLUESKY_PASSWORD'] == 'test_password'

    def test_app_routes_registered(self, app):
        """Test that all routes are registered."""
        # Get all registered routes
        routes = [rule.rule for rule in app.url_map.iter_rules()]
        
        # Check that all expected routes are registered
        assert '/' in routes
        assert '/dashboard' in routes
        assert '/fetch-data' in routes
        assert '/analyze-sentiment' in routes
        assert '/get-data-files' in routes
        assert '/get-sentiment-files' in routes
        assert '/visualize/<file_type>/<filename>' in routes

    @patch('nltk.download')
    def test_nltk_resources_downloaded(self, mock_download, app):
        """Test that NLTK resources are downloaded if not present."""
        # Setup mock to simulate missing NLTK resources
        with patch('nltk.data.find') as mock_find:
            mock_find.side_effect = LookupError("Resource not found")
            
            # Create a new app to trigger NLTK downloads
            from app import create_app
            test_app = create_app({
                'TESTING': True,
                'SECRET_KEY': 'test_secret_key'
            })
            
            # Assertions
            assert mock_download.call_count >= 2
            mock_download.assert_any_call('punkt')
            mock_download.assert_any_call('stopwords')

    def test_instance_path_creation(self, app):
        """Test that the instance path is created."""
        assert os.path.exists(app.instance_path)

    def test_app_with_test_config(self):
        """Test app creation with test config."""
        from app import create_app
        
        test_config = {
            'TESTING': True,
            'SECRET_KEY': 'test',
            'DATABASE_URI': 'sqlite:///:memory:',
            'CUSTOM_SETTING': 'custom_value'
        }
        
        app = create_app(test_config)
        
        assert app.config['TESTING'] is True
        assert app.config['SECRET_KEY'] == 'test'
        assert app.config['DATABASE_URI'] == 'sqlite:///:memory:'
        assert app.config['CUSTOM_SETTING'] == 'custom_value'

    def test_app_with_instance_config(self, monkeypatch, tmp_path):
        """Test app creation with instance config."""
        from app import create_app
        
        # Create a temporary instance folder with a config.py file
        instance_path = tmp_path / "instance"
        instance_path.mkdir()
        config_file = instance_path / "config.py"
        config_file.write_text('INSTANCE_SETTING = "instance_value"')
        
        # Patch the instance path
        monkeypatch.setattr('flask.Flask.instance_path', str(instance_path))
        
        # Create app
        app = create_app()
        
        # Assertions
        assert app.config.get('INSTANCE_SETTING') == 'instance_value'

    def test_app_environment_variables(self, monkeypatch):
        """Test app creation with environment variables."""
        from app import create_app
        
        # Set environment variables
        monkeypatch.setenv('SECRET_KEY', 'env_secret')
        monkeypatch.setenv('DATABASE_URI', 'sqlite:///env_db.db')
        monkeypatch.setenv('BLUESKY_USERNAME', 'env_user')
        monkeypatch.setenv('BLUESKY_PASSWORD', 'env_pass')
        
        # Create app
        app = create_app()
        
        # Assertions
        assert app.config['SECRET_KEY'] == 'env_secret'
        assert app.config['DATABASE_URI'] == 'sqlite:///env_db.db'
        assert app.config['BLUESKY_USERNAME'] == 'env_user'
        assert app.config['BLUESKY_PASSWORD'] == 'env_pass' 