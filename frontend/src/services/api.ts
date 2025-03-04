import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
  timestamp: string;
}

export interface SentimentData {
  symbol: string;
  date: string;
  score: number;
  volume: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  sentiment: number;
}

// API functions
export const getStockData = async (symbol: string, timeRange: string): Promise<StockData> => {
  const response = await api.get<StockData>(`/stocks/${symbol}`, {
    params: { timeRange },
  });
  return response.data;
};

export const getStockHistory = async (symbol: string, timeRange: string): Promise<StockData[]> => {
  const response = await api.get<StockData[]>(`/stocks/${symbol}/history`, {
    params: { timeRange },
  });
  return response.data;
};

export const getSentimentData = async (symbol: string, timeRange: string): Promise<SentimentData[]> => {
  const response = await api.get<SentimentData[]>(`/sentiment/${symbol}`, {
    params: { timeRange },
  });
  return response.data;
};

export const getRecentPosts = async (symbol: string, limit: number = 10): Promise<Post[]> => {
  const response = await api.get<Post[]>(`/posts/${symbol}`, {
    params: { limit },
  });
  return response.data;
};

export const runAnalysis = async (symbol: string, timeRange: string): Promise<{
  stockData: StockData[];
  sentimentData: SentimentData[];
  correlation: number;
  summary: string;
}> => {
  const response = await api.post('/analyze', {
    symbol,
    timeRange,
  });
  return response.data;
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 