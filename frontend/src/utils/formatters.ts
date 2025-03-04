/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency symbol (default: $)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = '$',
  decimals: number = 2
): string => {
  return `${currency}${value.toFixed(decimals)}`;
};

/**
 * Format a number as percentage
 * @param value - The number to format (0.1 = 10%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format a date string
 * @param dateString - ISO date string
 * @param format - Format type ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'medium':
    default:
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
};

/**
 * Format a number with thousands separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format a sentiment score (-1 to 1) as a descriptive string
 * @param score - Sentiment score between -1 and 1
 * @returns Descriptive string
 */
export const formatSentiment = (score: number): string => {
  if (score >= 0.6) return 'Very Positive';
  if (score >= 0.2) return 'Positive';
  if (score >= -0.2) return 'Neutral';
  if (score >= -0.6) return 'Negative';
  return 'Very Negative';
};

/**
 * Format a time ago string (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @returns Time ago string
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a month
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  
  // Default to regular date
  return formatDate(dateString, 'short');
}; 