// Complete Authentication Utility for Cookie-Based Auth
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Create axios instance with cookie support
export const createAuthenticatedAxios = () => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 180000, // 3 minutes
    withCredentials: true, // Essential for cookie-based authentication
  });

  // Response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        
        return Promise.reject(error);
      }

      // Handle 403 Forbidden (email not verified)
      if (error.response?.status === 403) {
        const data = error.response.data as any;
        if (data?.code === 'EMAIL_NOT_VERIFIED') {
          if (typeof window !== 'undefined') {
            window.location.href = '/verify-email';
          }
        }
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Export default axios instance
export const authenticatedAxios = createAuthenticatedAxios();
