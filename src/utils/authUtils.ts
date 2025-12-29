// Complete Authentication Utility for Cookie-Based Auth
import axios from 'axios';

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Network error
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'Network error. Please check your internet connection.';
    }

    // Timeout error
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. The analysis is taking longer than expected.';
    }

    // Server errors
    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
      case 400:
        return message || 'Invalid request. Please check your inputs.';
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return message || 'Access forbidden. Please verify your email.';
      case 404:
        return message || 'Resource not found.';
      case 413:
        return 'File too large. Maximum size is 10MB.';
      case 429:
        return message || 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return message || 'Service temporarily unavailable.';
      default:
        return message || 'An unexpected error occurred.';
    }
  }

  return error?.message || 'An unexpected error occurred.';
};

