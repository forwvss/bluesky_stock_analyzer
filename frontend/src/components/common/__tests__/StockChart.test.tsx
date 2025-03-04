import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import StockChart from '../StockChart';

// Create a theme for testing
const theme = createTheme();

// Mock chart data
const mockChartData = [
  { date: '2023-01-01', value: 150.25 },
  { date: '2023-01-02', value: 152.75 },
  { date: '2023-01-03', value: 151.50 },
  { date: '2023-01-04', value: 153.25 },
  { date: '2023-01-05', value: 155.00 },
];

// Mock Recharts components
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    Line: () => <div data-testid="chart-line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

describe('StockChart Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    );
  };

  test('renders chart with data', () => {
    renderWithTheme(
      <StockChart 
        data={mockChartData} 
        dataKey="value" 
        xAxisDataKey="date" 
        title="Stock Price History" 
      />
    );
    
    // Check if chart components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    // Check if title is rendered
    expect(screen.getByText('Stock Price History')).toBeInTheDocument();
  });

  test('renders chart with custom color', () => {
    renderWithTheme(
      <StockChart 
        data={mockChartData} 
        dataKey="value" 
        xAxisDataKey="date" 
        title="Stock Price History" 
        color="#ff0000"
      />
    );
    
    // Check if chart components are rendered
    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
  });

  test('renders chart with custom height', () => {
    renderWithTheme(
      <StockChart 
        data={mockChartData} 
        dataKey="value" 
        xAxisDataKey="date" 
        title="Stock Price History" 
        height={400}
      />
    );
    
    // Check if chart components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('renders empty state when no data is provided', () => {
    renderWithTheme(
      <StockChart 
        data={[]} 
        dataKey="value" 
        xAxisDataKey="date" 
        title="Stock Price History" 
      />
    );
    
    // Check if empty state message is displayed
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  test('renders loading state when loading prop is true', () => {
    renderWithTheme(
      <StockChart 
        data={mockChartData} 
        dataKey="value" 
        xAxisDataKey="date" 
        title="Stock Price History" 
        loading={true}
      />
    );
    
    // Check if loading indicator is displayed
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
}); 