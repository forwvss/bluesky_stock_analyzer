import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StockProvider, useStock } from '../StockContext';
import * as api from '../../services/api';

// Mock the API service
jest.mock('../../services/api');

// Mock stock data
const mockStockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  change: 2.75,
  changePercent: 0.0186,
};

const mockStockHistory = [
  { date: '2023-01-01', value: 150.25 },
  { date: '2023-01-02', value: 152.75 },
];

const mockSentimentData = {
  overall: 0.65,
  twitter: 0.7,
  news: 0.6,
  reddit: 0.65,
};

const mockRecentPosts = [
  { id: 1, source: 'Twitter', content: 'Great news for $AAPL!', sentiment: 0.8, date: '2023-01-02T12:00:00Z' },
  { id: 2, source: 'News', content: 'Apple reports strong earnings', sentiment: 0.6, date: '2023-01-01T10:00:00Z' },
];

// Mock component that uses the stock context
const TestComponent = () => {
  const { 
    currentStock, 
    stockHistory, 
    sentimentData, 
    recentPosts, 
    loading, 
    error, 
    fetchStockData 
  } = useStock();
  
  return (
    <div>
      <button onClick={() => fetchStockData('AAPL')}>Fetch AAPL</button>
      <button onClick={() => fetchStockData('MSFT')}>Fetch MSFT</button>
      
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">{error}</div>}
      
      {currentStock && (
        <div data-testid="stock-data">
          <div>{currentStock.symbol}</div>
          <div>{currentStock.price}</div>
        </div>
      )}
      
      {stockHistory && stockHistory.length > 0 && (
        <div data-testid="stock-history">
          {stockHistory.length} data points
        </div>
      )}
      
      {sentimentData && (
        <div data-testid="sentiment-data">
          {sentimentData.overall}
        </div>
      )}
      
      {recentPosts && recentPosts.length > 0 && (
        <div data-testid="recent-posts">
          {recentPosts.length} posts
        </div>
      )}
    </div>
  );
};

describe('StockContext', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    
    // Setup default mock implementations
    (api.getStockData as jest.Mock).mockResolvedValue(mockStockData);
    (api.getStockHistory as jest.Mock).mockResolvedValue(mockStockHistory);
    (api.getSentimentData as jest.Mock).mockResolvedValue(mockSentimentData);
    (api.getRecentPosts as jest.Mock).mockResolvedValue(mockRecentPosts);
  });

  test('provides initial empty state', () => {
    render(
      <StockProvider>
        <TestComponent />
      </StockProvider>
    );
    
    // Initial state should be empty
    expect(screen.queryByTestId('stock-data')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stock-history')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sentiment-data')).not.toBeInTheDocument();
    expect(screen.queryByTestId('recent-posts')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('fetches stock data when fetchStockData is called', async () => {
    render(
      <StockProvider>
        <TestComponent />
      </StockProvider>
    );
    
    // Click the fetch button
    fireEvent.click(screen.getByText('Fetch AAPL'));
    
    // Should show loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
    
    // Should have called the API functions
    expect(api.getStockData).toHaveBeenCalledWith('AAPL');
    expect(api.getStockHistory).toHaveBeenCalledWith('AAPL');
    expect(api.getSentimentData).toHaveBeenCalledWith('AAPL');
    expect(api.getRecentPosts).toHaveBeenCalledWith('AAPL');
    
    // Should display the fetched data
    expect(screen.getByTestId('stock-data')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('150.25')).toBeInTheDocument();
    
    expect(screen.getByTestId('stock-history')).toBeInTheDocument();
    expect(screen.getByText('2 data points')).toBeInTheDocument();
    
    expect(screen.getByTestId('sentiment-data')).toBeInTheDocument();
    expect(screen.getByText('0.65')).toBeInTheDocument();
    
    expect(screen.getByTestId('recent-posts')).toBeInTheDocument();
    expect(screen.getByText('2 posts')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    // Mock API to throw an error
    (api.getStockData as jest.Mock).mockRejectedValue(new Error('Failed to fetch stock data'));
    
    render(
      <StockProvider>
        <TestComponent />
      </StockProvider>
    );
    
    // Click the fetch button
    fireEvent.click(screen.getByText('Fetch AAPL'));
    
    // Should show loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
    
    // Should display the error message
    expect(screen.getByText(/Failed to fetch stock data/i)).toBeInTheDocument();
    
    // Should not display any data
    expect(screen.queryByTestId('stock-data')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stock-history')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sentiment-data')).not.toBeInTheDocument();
    expect(screen.queryByTestId('recent-posts')).not.toBeInTheDocument();
  });

  test('updates state when fetching different stock', async () => {
    // Mock different data for MSFT
    const msftData = { ...mockStockData, symbol: 'MSFT', name: 'Microsoft Corp', price: 300.50 };
    
    render(
      <StockProvider>
        <TestComponent />
      </StockProvider>
    );
    
    // First fetch AAPL
    fireEvent.click(screen.getByText('Fetch AAPL'));
    
    // Wait for AAPL data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByText('AAPL')).toBeInTheDocument();
    });
    
    // Now mock MSFT data
    (api.getStockData as jest.Mock).mockResolvedValue(msftData);
    
    // Fetch MSFT
    fireEvent.click(screen.getByText('Fetch MSFT'));
    
    // Should show loading state again
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    // Wait for MSFT data to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByText('MSFT')).toBeInTheDocument();
      expect(screen.getByText('300.5')).toBeInTheDocument();
    });
    
    // AAPL data should no longer be visible
    expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
  });
}); 