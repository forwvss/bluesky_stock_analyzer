import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeContext } from '../../../App';

// Mock the ColorModeContext
const mockToggleColorMode = jest.fn();
const colorModeContextValue = {
  toggleColorMode: mockToggleColorMode,
};

describe('Header Component', () => {
  const renderHeader = () => {
    const theme = createTheme();
    return render(
      <ColorModeContext.Provider value={colorModeContextValue}>
        <ThemeProvider theme={theme}>
          <Header />
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the header with logo and title', () => {
    renderHeader();
    
    // Check if the title is rendered
    expect(screen.getByText(/BLUESKY STOCK/i)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderHeader();
    
    // Check if navigation links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  test('toggles dark mode when button is clicked', () => {
    renderHeader();
    
    // Find and click the dark mode toggle button
    const darkModeButton = screen.getByLabelText('toggle dark mode');
    fireEvent.click(darkModeButton);
    
    // Check if the toggle function was called
    expect(mockToggleColorMode).toHaveBeenCalledTimes(1);
  });

  test('opens mobile menu when menu button is clicked', () => {
    // Mock window.innerWidth to simulate mobile view
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    renderHeader();
    
    // Find and click the menu button
    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);
    
    // Check if the menu is opened
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  test('closes mobile menu when a menu item is clicked', () => {
    // Mock window.innerWidth to simulate mobile view
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    renderHeader();
    
    // Open the menu
    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);
    
    // Click a menu item
    const dashboardLink = screen.getByText('Dashboard');
    fireEvent.click(dashboardLink);
    
    // Check if the menu is closed
    expect(screen.queryByRole('menu')).not.toBeVisible();
  });
}); 