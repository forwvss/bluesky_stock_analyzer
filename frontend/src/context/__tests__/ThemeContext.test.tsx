import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock component that uses the theme context
const TestComponent = () => {
  const { mode, toggleColorMode } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-mode">{mode}</div>
      <button onClick={toggleColorMode}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('provides default theme mode as light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  test('toggles theme mode when toggle function is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial mode should be light
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    
    // Click the toggle button
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Mode should now be dark
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    
    // Click the toggle button again
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Mode should be back to light
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  test('persists theme mode in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial mode should be light
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    
    // Click the toggle button to change to dark
    fireEvent.click(screen.getByText('Toggle Theme'));
    
    // Check localStorage
    expect(localStorage.getItem('themeMode')).toBe('dark');
    
    // Unmount and remount to test persistence
    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    unmount();
    
    // Render again
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Mode should still be dark from localStorage
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  test('uses system preference when no localStorage value exists', () => {
    // Mock window.matchMedia to simulate system preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Mode should be dark based on system preference
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  test('handles localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is not available');
    });
    
    // Should not throw an error when rendering
    expect(() => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    }).not.toThrow();
    
    // Should default to light mode
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    
    // Restore the original implementation
    jest.restoreAllMocks();
  });
}); 