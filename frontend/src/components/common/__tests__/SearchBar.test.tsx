import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import SearchBar from '../SearchBar';

// Create a theme for testing
const theme = createTheme();

describe('SearchBar Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    );
  };

  test('renders search bar with default placeholder', () => {
    renderWithTheme(<SearchBar onSearch={jest.fn()} />);
    
    // Check if the search input is rendered with default placeholder
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeInTheDocument();
    
    // Check if the search button is rendered
    const searchButton = screen.getByRole('button');
    expect(searchButton).toBeInTheDocument();
  });

  test('renders search bar with custom placeholder', () => {
    renderWithTheme(<SearchBar onSearch={jest.fn()} placeholder="Search stocks..." />);
    
    // Check if the search input is rendered with custom placeholder
    const searchInput = screen.getByPlaceholderText('Search stocks...');
    expect(searchInput).toBeInTheDocument();
  });

  test('calls onSearch when search button is clicked', () => {
    const mockOnSearch = jest.fn();
    renderWithTheme(<SearchBar onSearch={mockOnSearch} />);
    
    // Type in the search input
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'AAPL' } });
    
    // Click the search button
    const searchButton = screen.getByRole('button');
    fireEvent.click(searchButton);
    
    // Check if onSearch was called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith('AAPL');
  });

  test('calls onSearch when Enter key is pressed', () => {
    const mockOnSearch = jest.fn();
    renderWithTheme(<SearchBar onSearch={mockOnSearch} />);
    
    // Type in the search input and press Enter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'AAPL' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    // Check if onSearch was called with the correct value
    expect(mockOnSearch).toHaveBeenCalledWith('AAPL');
  });

  test('does not call onSearch when other keys are pressed', () => {
    const mockOnSearch = jest.fn();
    renderWithTheme(<SearchBar onSearch={mockOnSearch} />);
    
    // Type in the search input and press a key other than Enter
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'AAPL' } });
    fireEvent.keyDown(searchInput, { key: 'A', code: 'KeyA' });
    
    // Check if onSearch was not called
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('renders with initial value', () => {
    renderWithTheme(<SearchBar onSearch={jest.fn()} initialValue="AAPL" />);
    
    // Check if the search input has the initial value
    const searchInput = screen.getByDisplayValue('AAPL');
    expect(searchInput).toBeInTheDocument();
  });

  test('renders with custom button text', () => {
    renderWithTheme(<SearchBar onSearch={jest.fn()} buttonText="Find" />);
    
    // Check if the button has the custom text
    const searchButton = screen.getByText('Find');
    expect(searchButton).toBeInTheDocument();
  });

  test('renders in disabled state', () => {
    renderWithTheme(<SearchBar onSearch={jest.fn()} disabled={true} />);
    
    // Check if the search input and button are disabled
    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toBeDisabled();
    
    const searchButton = screen.getByRole('button');
    expect(searchButton).toBeDisabled();
  });

  test('renders with loading state', () => {
    renderWithTheme(<SearchBar onSearch={jest.fn()} loading={true} />);
    
    // Check if the loading indicator is displayed
    const loadingIndicator = screen.getByRole('progressbar');
    expect(loadingIndicator).toBeInTheDocument();
    
    // Check if the search button is disabled during loading
    const searchButton = screen.getByRole('button');
    expect(searchButton).toBeDisabled();
  });
}); 