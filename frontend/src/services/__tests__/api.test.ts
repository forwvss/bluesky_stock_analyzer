import axios from 'axios';
import api, {
  getStockData,
  getStockHistory,
  getSentimentData,
  getRecentPosts,
  runAnalysis,
} from '../api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getStockData fetches stock data for a symbol', async () => {
    // Mock data
    const mockStockData = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.25,
      change: 2.5,
      changePercent: 1.69,
      open: 148.0,
      high: 151.0,
      low: 147.5,
      volume: 75000000,
      previousClose: 147.75,
      timestamp: '2023-06-01T16:00:00Z',
    };

    // Mock axios response
    mockedAxios.get.mockResolvedValueOnce({ data: mockStockData });

    // Call the function
    const result = await getStockData('AAPL', '1d');

    // Check if axios was called with the correct parameters
    expect(mockedAxios.get).toHaveBeenCalledWith('/stocks/AAPL', {
      params: { timeRange: '1d' },
    });

    // Check if the function returns the correct data
    expect(result).toEqual(mockStockData);
  });

  test('getStockHistory fetches historical stock data', async () => {
    // Mock data
    const mockHistoryData = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 150.25,
        change: 2.5,
        changePercent: 1.69,
        open: 148.0,
        high: 151.0,
        low: 147.5,
        volume: 75000000,
        previousClose: 147.75,
        timestamp: '2023-06-01T16:00:00Z',
      },
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 147.75,
        change: -1.25,
        changePercent: -0.84,
        open: 149.0,
        high: 149.5,
        low: 147.0,
        volume: 65000000,
        previousClose: 149.0,
        timestamp: '2023-05-31T16:00:00Z',
      },
    ];

    // Mock axios response
    mockedAxios.get.mockResolvedValueOnce({ data: mockHistoryData });

    // Call the function
    const result = await getStockHistory('AAPL', '1w');

    // Check if axios was called with the correct parameters
    expect(mockedAxios.get).toHaveBeenCalledWith('/stocks/AAPL/history', {
      params: { timeRange: '1w' },
    });

    // Check if the function returns the correct data
    expect(result).toEqual(mockHistoryData);
  });

  test('getSentimentData fetches sentiment data for a symbol', async () => {
    // Mock data
    const mockSentimentData = [
      {
        symbol: 'AAPL',
        date: '2023-06-01',
        score: 0.75,
        volume: 1250,
        positiveCount: 850,
        negativeCount: 250,
        neutralCount: 150,
      },
      {
        symbol: 'AAPL',
        date: '2023-05-31',
        score: 0.65,
        volume: 980,
        positiveCount: 650,
        negativeCount: 230,
        neutralCount: 100,
      },
    ];

    // Mock axios response
    mockedAxios.get.mockResolvedValueOnce({ data: mockSentimentData });

    // Call the function
    const result = await getSentimentData('AAPL', '1w');

    // Check if axios was called with the correct parameters
    expect(mockedAxios.get).toHaveBeenCalledWith('/sentiment/AAPL', {
      params: { timeRange: '1w' },
    });

    // Check if the function returns the correct data
    expect(result).toEqual(mockSentimentData);
  });

  test('getRecentPosts fetches recent posts for a symbol', async () => {
    // Mock data
    const mockPosts = [
      {
        id: 'post1',
        author: 'user1',
        content: 'I love my new iPhone! $AAPL is doing great.',
        timestamp: '2023-06-01T14:30:00Z',
        sentiment: 0.8,
      },
      {
        id: 'post2',
        author: 'user2',
        content: 'Just bought some $AAPL shares. Looking forward to the next product launch.',
        timestamp: '2023-06-01T13:45:00Z',
        sentiment: 0.6,
      },
    ];

    // Mock axios response
    mockedAxios.get.mockResolvedValueOnce({ data: mockPosts });

    // Call the function
    const result = await getRecentPosts('AAPL', 5);

    // Check if axios was called with the correct parameters
    expect(mockedAxios.get).toHaveBeenCalledWith('/posts/AAPL', {
      params: { limit: 5 },
    });

    // Check if the function returns the correct data
    expect(result).toEqual(mockPosts);
  });

  test('runAnalysis runs analysis for a symbol', async () => {
    // Mock data
    const mockAnalysisResult = {
      stockData: [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 150.25,
          change: 2.5,
          changePercent: 1.69,
          open: 148.0,
          high: 151.0,
          low: 147.5,
          volume: 75000000,
          previousClose: 147.75,
          timestamp: '2023-06-01T16:00:00Z',
        },
      ],
      sentimentData: [
        {
          symbol: 'AAPL',
          date: '2023-06-01',
          score: 0.75,
          volume: 1250,
          positiveCount: 850,
          negativeCount: 250,
          neutralCount: 150,
        },
      ],
      correlation: 0.72,
      summary: 'Strong positive correlation between sentiment and stock price.',
    };

    // Mock axios response
    mockedAxios.post.mockResolvedValueOnce({ data: mockAnalysisResult });

    // Call the function
    const result = await runAnalysis('AAPL', '1m');

    // Check if axios was called with the correct parameters
    expect(mockedAxios.post).toHaveBeenCalledWith('/analyze', {
      symbol: 'AAPL',
      timeRange: '1m',
    });

    // Check if the function returns the correct data
    expect(result).toEqual(mockAnalysisResult);
  });

  test('API handles errors correctly', async () => {
    // Mock error response
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    // Mock console.error
    const originalConsoleError = console.error;
    const mockConsoleError = jest.fn();
    console.error = mockConsoleError;

    // Call the function and expect it to throw
    await expect(getStockData('AAPL', '1d')).rejects.toThrow(errorMessage);

    // Check if error was logged
    expect(mockConsoleError).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });
}); 