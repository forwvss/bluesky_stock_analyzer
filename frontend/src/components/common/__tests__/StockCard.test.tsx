import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import StockCard from '../StockCard';

// Create a theme for testing
const theme = createTheme();

// Mock stock data
const mockStockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  change: 2.75,
  changePercent: 0.0186,
  volume: 75000000,
  marketCap: 2500000000000,
  pe: 28.5,
  dividend: 0.82,
  sector: 'Technology',
};

describe('StockCard Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    );
  };

  test('renders stock card with basic information', () => {
    renderWithTheme(<StockCard stock={mockStockData} />);
    
    // Check if basic stock information is displayed
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText(/\$150\.25/)).toBeInTheDocument();
  });

  test('displays positive change with green color', () => {
    renderWithTheme(<StockCard stock={mockStockData} />);
    
    const changeElement = screen.getByText(/\+\$2\.75/);
    expect(changeElement).toBeInTheDocument();
    
    const percentElement = screen.getByText(/\+1\.86%/);
    expect(percentElement).toBeInTheDocument();
    
    // Check that both elements have the success color class
    // Note: The exact implementation of how color is applied may vary
    // This is a simplified test that assumes color is applied via a class or style
    expect(changeElement.closest('div')).toHaveStyle('color: rgb(46, 125, 50)'); // success.main color
  });

  test('displays negative change with red color', () => {
    const negativeStockData = {
      ...mockStockData,
      change: -2.75,
      changePercent: -0.0186,
    };
    
    renderWithTheme(<StockCard stock={negativeStockData} />);
    
    const changeElement = screen.getByText(/\-\$2\.75/);
    expect(changeElement).toBeInTheDocument();
    
    const percentElement = screen.getByText(/\-1\.86%/);
    expect(percentElement).toBeInTheDocument();
    
    // Check that both elements have the error color class
    expect(changeElement.closest('div')).toHaveStyle('color: rgb(211, 47, 47)'); // error.main color
  });

  test('displays additional stock information', () => {
    renderWithTheme(<StockCard stock={mockStockData} />);
    
    // Check if additional stock information is displayed
    expect(screen.getByText(/Volume/)).toBeInTheDocument();
    expect(screen.getByText(/75,000,000/)).toBeInTheDocument();
    
    expect(screen.getByText(/Market Cap/)).toBeInTheDocument();
    expect(screen.getByText(/\$2\.5T/)).toBeInTheDocument();
    
    expect(screen.getByText(/P\/E Ratio/)).toBeInTheDocument();
    expect(screen.getByText(/28\.5/)).toBeInTheDocument();
    
    expect(screen.getByText(/Dividend/)).toBeInTheDocument();
    expect(screen.getByText(/0\.82%/)).toBeInTheDocument();
    
    expect(screen.getByText(/Sector/)).toBeInTheDocument();
    expect(screen.getByText(/Technology/)).toBeInTheDocument();
  });

  test('renders stock card with minimal props', () => {
    const minimalStockData = {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.25,
      change: 2.75,
      changePercent: 0.0186,
    };
    
    renderWithTheme(<StockCard stock={minimalStockData} />);
    
    // Check if basic stock information is displayed
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText(/\$150\.25/)).toBeInTheDocument();
    
    // Check that optional fields are not displayed or show as N/A
    expect(screen.queryByText(/Volume/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Market Cap/)).not.toBeInTheDocument();
    expect(screen.queryByText(/P\/E Ratio/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Dividend/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sector/)).not.toBeInTheDocument();
  });
}); 