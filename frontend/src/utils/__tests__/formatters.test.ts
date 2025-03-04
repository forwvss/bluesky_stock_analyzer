import {
  formatCurrency,
  formatPercentage,
  formatDate,
  formatNumber,
  formatSentiment,
  formatTimeAgo,
} from '../formatters';

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    test('formats a number as currency with default options', () => {
      expect(formatCurrency(1234.56)).toBe('$1234.56');
    });

    test('formats a number as currency with custom currency symbol', () => {
      expect(formatCurrency(1234.56, '€')).toBe('€1234.56');
    });

    test('formats a number as currency with custom decimal places', () => {
      expect(formatCurrency(1234.56789, '$', 3)).toBe('$1234.568');
    });

    test('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    test('handles negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('$-1234.56');
    });
  });

  describe('formatPercentage', () => {
    test('formats a decimal as percentage with default options', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%');
    });

    test('formats a decimal as percentage with custom decimal places', () => {
      expect(formatPercentage(0.1234, 1)).toBe('12.3%');
    });

    test('handles zero correctly', () => {
      expect(formatPercentage(0)).toBe('0.00%');
    });

    test('handles negative numbers correctly', () => {
      expect(formatPercentage(-0.1234)).toBe('-12.34%');
    });
  });

  describe('formatDate', () => {
    // Mock Date to ensure consistent test results
    const mockDate = new Date('2023-06-01T12:00:00Z');
    
    test('formats a date with default (medium) format', () => {
      expect(formatDate(mockDate.toISOString())).toMatch(/Jun 1, 2023/);
    });

    test('formats a date with short format', () => {
      const result = formatDate(mockDate.toISOString(), 'short');
      // The exact format depends on the locale, so we just check for the date components
      expect(result).toContain('2023');
      expect(result.length).toBeLessThan(15); // Short format should be concise
    });

    test('formats a date with long format', () => {
      const result = formatDate(mockDate.toISOString(), 'long');
      // The exact format depends on the locale, so we just check for the date components
      expect(result).toContain('2023');
      expect(result).toContain('June'); // Long format should include full month name
      expect(result.length).toBeGreaterThan(10); // Long format should be verbose
    });
  });

  describe('formatNumber', () => {
    test('formats a number with default options (no decimals)', () => {
      expect(formatNumber(1234567)).toMatch(/1,234,567/);
    });

    test('formats a number with custom decimal places', () => {
      expect(formatNumber(1234.56789, 2)).toMatch(/1,234.57/);
    });

    test('handles zero correctly', () => {
      expect(formatNumber(0)).toBe('0');
    });

    test('handles negative numbers correctly', () => {
      expect(formatNumber(-1234567)).toMatch(/-1,234,567/);
    });
  });

  describe('formatSentiment', () => {
    test('formats very positive sentiment', () => {
      expect(formatSentiment(0.8)).toBe('Very Positive');
    });

    test('formats positive sentiment', () => {
      expect(formatSentiment(0.4)).toBe('Positive');
    });

    test('formats neutral sentiment', () => {
      expect(formatSentiment(0)).toBe('Neutral');
    });

    test('formats negative sentiment', () => {
      expect(formatSentiment(-0.4)).toBe('Negative');
    });

    test('formats very negative sentiment', () => {
      expect(formatSentiment(-0.8)).toBe('Very Negative');
    });
  });

  describe('formatTimeAgo', () => {
    // Mock current date for consistent test results
    const originalDate = global.Date;
    const mockNow = new Date('2023-06-01T12:00:00Z');
    
    beforeEach(() => {
      global.Date = class extends Date {
        constructor() {
          super();
          return mockNow;
        }
        static now() {
          return mockNow.getTime();
        }
      } as any;
    });
    
    afterEach(() => {
      global.Date = originalDate;
    });

    test('formats time just now', () => {
      const date = new Date(mockNow.getTime() - 30 * 1000); // 30 seconds ago
      expect(formatTimeAgo(date.toISOString())).toBe('just now');
    });

    test('formats time in minutes', () => {
      const date = new Date(mockNow.getTime() - 5 * 60 * 1000); // 5 minutes ago
      expect(formatTimeAgo(date.toISOString())).toBe('5 minutes ago');
    });

    test('formats time in singular minute', () => {
      const date = new Date(mockNow.getTime() - 1 * 60 * 1000); // 1 minute ago
      expect(formatTimeAgo(date.toISOString())).toBe('1 minute ago');
    });

    test('formats time in hours', () => {
      const date = new Date(mockNow.getTime() - 3 * 60 * 60 * 1000); // 3 hours ago
      expect(formatTimeAgo(date.toISOString())).toBe('3 hours ago');
    });

    test('formats time in singular hour', () => {
      const date = new Date(mockNow.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
      expect(formatTimeAgo(date.toISOString())).toBe('1 hour ago');
    });

    test('formats time in days', () => {
      const date = new Date(mockNow.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
      expect(formatTimeAgo(date.toISOString())).toBe('2 days ago');
    });

    test('formats time in singular day', () => {
      const date = new Date(mockNow.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
      expect(formatTimeAgo(date.toISOString())).toBe('1 day ago');
    });

    test('formats time in weeks', () => {
      const date = new Date(mockNow.getTime() - 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks ago
      expect(formatTimeAgo(date.toISOString())).toBe('2 weeks ago');
    });

    test('formats time in singular week', () => {
      const date = new Date(mockNow.getTime() - 1 * 7 * 24 * 60 * 60 * 1000); // 1 week ago
      expect(formatTimeAgo(date.toISOString())).toBe('1 week ago');
    });

    test('formats time as date for older dates', () => {
      const date = new Date(mockNow.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      expect(formatTimeAgo(date.toISOString())).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });
}); 