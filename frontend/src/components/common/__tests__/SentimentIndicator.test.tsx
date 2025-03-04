import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import SentimentIndicator from '../SentimentIndicator';

// Create a theme for testing
const theme = createTheme();

describe('SentimentIndicator Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    );
  };

  test('renders very positive sentiment correctly', () => {
    renderWithTheme(<SentimentIndicator value={0.8} />);
    
    // Check if the sentiment text is displayed
    expect(screen.getByText('Very Positive')).toBeInTheDocument();
    
    // Check if the progress bar is rendered with the correct value
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '90');
    
    // Check if the color is correct for very positive sentiment
    expect(progressBar).toHaveStyle('color: rgb(46, 125, 50)'); // success.main color
  });

  test('renders positive sentiment correctly', () => {
    renderWithTheme(<SentimentIndicator value={0.4} />);
    
    // Check if the sentiment text is displayed
    expect(screen.getByText('Positive')).toBeInTheDocument();
    
    // Check if the progress bar is rendered with the correct value
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '70');
    
    // Check if the color is correct for positive sentiment
    expect(progressBar).toHaveStyle('color: rgb(56, 142, 60)'); // success.dark color
  });

  test('renders neutral sentiment correctly', () => {
    renderWithTheme(<SentimentIndicator value={0} />);
    
    // Check if the sentiment text is displayed
    expect(screen.getByText('Neutral')).toBeInTheDocument();
    
    // Check if the progress bar is rendered with the correct value
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    
    // Check if the color is correct for neutral sentiment
    expect(progressBar).toHaveStyle('color: rgb(97, 97, 97)'); // grey.700 color
  });

  test('renders negative sentiment correctly', () => {
    renderWithTheme(<SentimentIndicator value={-0.4} />);
    
    // Check if the sentiment text is displayed
    expect(screen.getByText('Negative')).toBeInTheDocument();
    
    // Check if the progress bar is rendered with the correct value
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '30');
    
    // Check if the color is correct for negative sentiment
    expect(progressBar).toHaveStyle('color: rgb(211, 47, 47)'); // error.main color
  });

  test('renders very negative sentiment correctly', () => {
    renderWithTheme(<SentimentIndicator value={-0.8} />);
    
    // Check if the sentiment text is displayed
    expect(screen.getByText('Very Negative')).toBeInTheDocument();
    
    // Check if the progress bar is rendered with the correct value
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '10');
    
    // Check if the color is correct for very negative sentiment
    expect(progressBar).toHaveStyle('color: rgb(198, 40, 40)'); // error.dark color
  });

  test('renders with custom size', () => {
    renderWithTheme(<SentimentIndicator value={0.5} size="small" />);
    
    // Check if the progress bar has the small size
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('size', 'small');
  });

  test('renders with custom thickness', () => {
    renderWithTheme(<SentimentIndicator value={0.5} thickness={10} />);
    
    // Check if the progress bar has the custom thickness
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('thickness', '10');
  });

  test('renders with showLabel=false', () => {
    renderWithTheme(<SentimentIndicator value={0.5} showLabel={false} />);
    
    // Check if the sentiment text is not displayed
    expect(screen.queryByText('Positive')).not.toBeInTheDocument();
  });
}); 