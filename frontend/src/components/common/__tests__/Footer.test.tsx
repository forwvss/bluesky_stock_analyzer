import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('Footer Component', () => {
  const renderFooter = () => {
    const theme = createTheme();
    return render(
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    );
  };

  test('renders the footer with application title', () => {
    renderFooter();
    
    // Check if the title is rendered
    expect(screen.getByText('Bluesky Stock Analyzer')).toBeInTheDocument();
  });

  test('renders the application description', () => {
    renderFooter();
    
    // Check if the description is rendered
    expect(
      screen.getByText('Analyze stock market trends using social media data from Bluesky.')
    ).toBeInTheDocument();
  });

  test('renders quick links section', () => {
    renderFooter();
    
    // Check if the quick links section is rendered
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    
    // Check if the links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  test('renders connect section with social media links', () => {
    renderFooter();
    
    // Check if the connect section is rendered
    expect(screen.getByText('Connect')).toBeInTheDocument();
    
    // Check if social media links are rendered
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThanOrEqual(3); // At least 3 social links
  });

  test('renders copyright information with current year', () => {
    // Mock the Date constructor to return a fixed date
    const originalDate = global.Date;
    const mockDate = new Date('2023-01-01T00:00:00Z');
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
      getFullYear() {
        return 2023;
      }
    } as any;
    
    renderFooter();
    
    // Check if the copyright text is rendered with the current year
    expect(screen.getByText(/Copyright © Bluesky Stock Analyzer 2023/i)).toBeInTheDocument();
    
    // Restore the original Date constructor
    global.Date = originalDate;
  });
}); 