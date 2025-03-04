import { createTheme } from '@mui/material/styles';
import { getDesignTokens, getThemedComponents } from '../themeUtils';

describe('Theme Utilities', () => {
  describe('getDesignTokens', () => {
    test('returns light mode palette when mode is light', () => {
      const tokens = getDesignTokens('light');
      expect(tokens.palette.mode).toBe('light');
      expect(tokens.palette.primary).toBeDefined();
      expect(tokens.palette.secondary).toBeDefined();
      expect(tokens.palette.background).toBeDefined();
    });

    test('returns dark mode palette when mode is dark', () => {
      const tokens = getDesignTokens('dark');
      expect(tokens.palette.mode).toBe('dark');
      expect(tokens.palette.primary).toBeDefined();
      expect(tokens.palette.secondary).toBeDefined();
      expect(tokens.palette.background).toBeDefined();
    });

    test('light and dark palettes have different background colors', () => {
      const lightTokens = getDesignTokens('light');
      const darkTokens = getDesignTokens('dark');
      
      expect(lightTokens.palette.background.default).not.toBe(
        darkTokens.palette.background.default
      );
    });
  });

  describe('getThemedComponents', () => {
    test('returns component overrides for light theme', () => {
      const theme = createTheme(getDesignTokens('light'));
      const components = getThemedComponents(theme);
      
      expect(components.MuiCard).toBeDefined();
      expect(components.MuiButton).toBeDefined();
      expect(components.MuiTextField).toBeDefined();
    });

    test('returns component overrides for dark theme', () => {
      const theme = createTheme(getDesignTokens('dark'));
      const components = getThemedComponents(theme);
      
      expect(components.MuiCard).toBeDefined();
      expect(components.MuiButton).toBeDefined();
      expect(components.MuiTextField).toBeDefined();
    });

    test('component styles are responsive to theme mode', () => {
      const lightTheme = createTheme(getDesignTokens('light'));
      const darkTheme = createTheme(getDesignTokens('dark'));
      
      const lightComponents = getThemedComponents(lightTheme);
      const darkComponents = getThemedComponents(darkTheme);
      
      // Check that some styles are different between light and dark mode
      // This is a simplified test - in a real app, you might want to check specific properties
      expect(JSON.stringify(lightComponents)).not.toBe(JSON.stringify(darkComponents));
    });
  });
}); 