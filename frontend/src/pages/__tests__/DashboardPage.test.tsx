import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DashboardPage from '../DashboardPage';

// Mock the API service
jest.mock('../../services/api', () => ({
  getStockData: jest.fn(),
  getStockHistory: jest.fn(),
  getSentimentData: jest.fn(),
  getRecentPosts: jest.fn(),
}));

describe('DashboardPage Component', () => {
  const renderDashboardPage = () => {
    const theme = createTheme();
    return render(
      <ThemeProvider theme={theme}>
        <DashboardPage />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the dashboard title', () => {
    renderDashboardPage();
    
    // Check if the title is rendered
    expect(screen.getByText('Stock Analysis Dashboard')).toBeInTheDocument();
  });

  test('renders the search and filter section', () => {
    renderDashboardPage();
    
    // Check if the search input is rendered
    expect(screen.getByLabelText('Stock Symbol')).toBeInTheDocument();
    
    // Check if the time range selector is rendered
    expect(screen.getByLabelText('Time Range')).toBeInTheDocument();
    
    // Check if the search button is rendered
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('updates stock symbol when input changes', () => {
    renderDashboardPage();
    
    // Get the stock symbol input
    const stockInput = screen.getByLabelText('Stock Symbol');
    
    // Change the input value
    fireEvent.change(stockInput, { target: { value: 'AAPL' } });
    
    // Check if the input value is updated
    expect(stockInput).toHaveValue('AAPL');
  });

  test('renders stock price history section', () => {
    renderDashboardPage();
    
    // Check if the section title is rendered
    expect(screen.getByText('Stock Price History')).toBeInTheDocument();
    
    // Check if the refresh button is rendered
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  test('renders stock information section', () => {
    renderDashboardPage();
    
    // Check if the section title is rendered
    expect(screen.getByText('Stock Information')).toBeInTheDocument();
    
    // Check if the placeholder text is rendered when no stock is selected
    expect(
      screen.getByText('Enter a stock symbol to view information')
    ).toBeInTheDocument();
  });

  test('renders sentiment analysis section', () => {
    renderDashboardPage();
    
    // Check if the section title is rendered
    expect(screen.getByText('Social Media Sentiment Analysis')).toBeInTheDocument();
    
    // Check if the placeholder text is rendered when no stock is selected
    expect(
      screen.getByText('Enter a stock symbol to view sentiment analysis')
    ).toBeInTheDocument();
  });

  test('renders recent posts section', () => {
    renderDashboardPage();
    
    // Check if the section title is rendered
    expect(screen.getByText('Recent Bluesky Posts')).toBeInTheDocument();
    
    // Check if the placeholder text is rendered when no stock is selected
    expect(
      screen.getByText('Enter a stock symbol to view recent posts')
    ).toBeInTheDocument();
  });

  test('calls search function when search button is clicked', () => {
    renderDashboardPage();
    
    // Mock console.log
    const originalConsoleLog = console.log;
    const mockConsoleLog = jest.fn();
    console.log = mockConsoleLog;
    
    // Get the stock symbol input and search button
    const stockInput = screen.getByLabelText('Stock Symbol');
    const searchButton = screen.getByText('Search');
    
    // Enter a stock symbol and click search
    fireEvent.change(stockInput, { target: { value: 'AAPL' } });
    fireEvent.click(searchButton);
    
    // Check if the search function was called with the correct parameters
    expect(mockConsoleLog).toHaveBeenCalledWith('Searching for AAPL with time range 1w');
    
    // Restore console.log
    console.log = originalConsoleLog;
  });
}); 