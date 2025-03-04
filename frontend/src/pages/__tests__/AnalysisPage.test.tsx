import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AnalysisPage from '../AnalysisPage';

// Mock the API service
jest.mock('../../services/api', () => ({
  runAnalysis: jest.fn(),
}));

describe('AnalysisPage Component', () => {
  const renderAnalysisPage = () => {
    const theme = createTheme();
    return render(
      <ThemeProvider theme={theme}>
        <AnalysisPage />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the analysis page title', () => {
    renderAnalysisPage();
    
    // Check if the title is rendered
    expect(screen.getByText('Detailed Stock Analysis')).toBeInTheDocument();
  });

  test('renders the search and filter section', () => {
    renderAnalysisPage();
    
    // Check if the search input is rendered
    expect(screen.getByLabelText('Stock Symbol')).toBeInTheDocument();
    
    // Check if the time range selector is rendered
    expect(screen.getByLabelText('Time Range')).toBeInTheDocument();
    
    // Check if the analyze button is rendered
    expect(screen.getByText('Analyze')).toBeInTheDocument();
  });

  test('renders placeholder content when no stock is selected', () => {
    renderAnalysisPage();
    
    // Check if the placeholder content is rendered
    expect(screen.getByText('Enter a Stock Symbol to Begin Analysis')).toBeInTheDocument();
    expect(
      screen.getByText(/Use the search field above to enter a stock symbol/i)
    ).toBeInTheDocument();
  });

  test('updates stock symbol when input changes', () => {
    renderAnalysisPage();
    
    // Get the stock symbol input
    const stockInput = screen.getByLabelText('Stock Symbol');
    
    // Change the input value
    fireEvent.change(stockInput, { target: { value: 'AAPL' } });
    
    // Check if the input value is updated
    expect(stockInput).toHaveValue('AAPL');
  });

  test('calls analyze function when analyze button is clicked', () => {
    renderAnalysisPage();
    
    // Mock console.log
    const originalConsoleLog = console.log;
    const mockConsoleLog = jest.fn();
    console.log = mockConsoleLog;
    
    // Get the stock symbol input and analyze button
    const stockInput = screen.getByLabelText('Stock Symbol');
    const analyzeButton = screen.getByText('Analyze');
    
    // Enter a stock symbol and click analyze
    fireEvent.change(stockInput, { target: { value: 'AAPL' } });
    fireEvent.click(analyzeButton);
    
    // Check if the analyze function was called with the correct parameters
    expect(mockConsoleLog).toHaveBeenCalledWith('Analyzing AAPL with time range 1m');
    
    // Restore console.log
    console.log = originalConsoleLog;
  });

  test('renders analysis tabs when stock is selected', () => {
    renderAnalysisPage();
    
    // Get the stock symbol input and analyze button
    const stockInput = screen.getByLabelText('Stock Symbol');
    
    // Enter a stock symbol to trigger rendering of analysis content
    fireEvent.change(stockInput, { target: { value: 'AAPL' } });
    
    // Force re-render of component with stock symbol
    renderAnalysisPage();
    
    // Check if the tabs are rendered
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument();
    expect(screen.getByText('Price Correlation')).toBeInTheDocument();
    expect(screen.getByText('Historical Data')).toBeInTheDocument();
  });

  test('switches between tabs when clicked', () => {
    renderAnalysisPage();
    
    // Get the stock symbol input
    const stockInput = screen.getByLabelText('Stock Symbol');
    
    // Enter a stock symbol to trigger rendering of analysis content
    fireEvent.change(stockInput, { target: { value: 'AAPL' } });
    
    // Force re-render of component with stock symbol
    renderAnalysisPage();
    
    // Click on the Sentiment Analysis tab
    fireEvent.click(screen.getByText('Sentiment Analysis'));
    
    // Check if the Sentiment Analysis content is rendered
    expect(screen.getByText('Sentiment Analysis Over Time')).toBeInTheDocument();
    
    // Click on the Price Correlation tab
    fireEvent.click(screen.getByText('Price Correlation'));
    
    // Check if the Price Correlation content is rendered
    expect(screen.getByText('Sentiment vs. Price Correlation')).toBeInTheDocument();
    
    // Click on the Historical Data tab
    fireEvent.click(screen.getByText('Historical Data'));
    
    // Check if the Historical Data content is rendered
    expect(screen.getByText('Historical Data')).toBeInTheDocument();
  });
}); 