import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

// Mock the page components
jest.mock('../pages/HomePage', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('../pages/DashboardPage', () => () => <div data-testid="dashboard-page">Dashboard Page</div>);
jest.mock('../pages/AnalysisPage', () => () => <div data-testid="analysis-page">Analysis Page</div>);
jest.mock('../pages/NotFoundPage', () => () => <div data-testid="not-found-page">Not Found Page</div>);

// Mock the common components
jest.mock('../components/common/Header', () => () => <header data-testid="header">Header</header>);
jest.mock('../components/common/Footer', () => () => <footer data-testid="footer">Footer</footer>);

describe('App Component', () => {
  test('renders the header and footer', () => {
    render(<App />);
    
    // Check if the header and footer are rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders the home page by default', () => {
    render(<App />);
    
    // Check if the home page is rendered
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('toggles color mode when theme is switched', () => {
    render(<App />);
    
    // Get the initial theme mode
    const initialMode = document.documentElement.getAttribute('data-mui-color-scheme');
    
    // Find and click the theme toggle button in the header
    // Note: Since we've mocked the Header component, we need to simulate the theme toggle here
    const toggleColorMode = (App as any).prototype.colorMode.toggleColorMode;
    toggleColorMode();
    
    // Check if the theme mode has changed
    const newMode = document.documentElement.getAttribute('data-mui-color-scheme');
    expect(newMode).not.toBe(initialMode);
  });
}); 