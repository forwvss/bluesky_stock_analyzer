import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NotFoundPage from '../NotFoundPage';

describe('NotFoundPage Component', () => {
  const renderNotFoundPage = () => {
    const theme = createTheme();
    return render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NotFoundPage />
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders the 404 error code', () => {
    renderNotFoundPage();
    
    // Check if the 404 error code is rendered
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('renders the "Page Not Found" heading', () => {
    renderNotFoundPage();
    
    // Check if the heading is rendered
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  test('renders the error message', () => {
    renderNotFoundPage();
    
    // Check if the error message is rendered
    expect(
      screen.getByText(/The page you are looking for might have been removed/i)
    ).toBeInTheDocument();
  });

  test('renders the "Back to Home" button', () => {
    renderNotFoundPage();
    
    // Check if the button is rendered
    const homeButton = screen.getByText('Back to Home');
    expect(homeButton).toBeInTheDocument();
    
    // Check if the button links to the home page
    expect(homeButton.closest('a')).toHaveAttribute('href', '/');
  });
}); 