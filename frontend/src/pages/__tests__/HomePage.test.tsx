import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomePage from '../HomePage';

describe('HomePage Component', () => {
  const renderHomePage = () => {
    const theme = createTheme();
    return render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <HomePage />
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  test('renders the hero section with title', () => {
    renderHomePage();
    
    // Check if the title is rendered
    expect(screen.getByText('Bluesky Stock Analyzer')).toBeInTheDocument();
  });

  test('renders the hero section with description', () => {
    renderHomePage();
    
    // Check if the description is rendered
    expect(
      screen.getByText(/Analyze stock market trends using social media data from Bluesky/i)
    ).toBeInTheDocument();
  });

  test('renders the "Go to Dashboard" button', () => {
    renderHomePage();
    
    // Check if the button is rendered
    const dashboardButton = screen.getByText('Go to Dashboard');
    expect(dashboardButton).toBeInTheDocument();
    
    // Check if the button links to the dashboard page
    expect(dashboardButton.closest('a')).toHaveAttribute('href', '/dashboard');
  });

  test('renders the features section', () => {
    renderHomePage();
    
    // Check if the features section is rendered
    expect(screen.getByText('Features')).toBeInTheDocument();
    
    // Check if feature cards are rendered
    expect(screen.getByText('Real-time Analysis')).toBeInTheDocument();
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument();
    expect(screen.getByText('Interactive Visualizations')).toBeInTheDocument();
  });

  test('renders the call to action section', () => {
    renderHomePage();
    
    // Check if the CTA section is rendered
    expect(screen.getByText('Ready to get started?')).toBeInTheDocument();
    
    // Check if the CTA buttons are rendered
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByText('View Analysis')).toBeInTheDocument();
  });
}); 