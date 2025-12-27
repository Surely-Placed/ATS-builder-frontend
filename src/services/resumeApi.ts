import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with cookie-only authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential - allows cookies to be sent with requests
  timeout: 180000, // 3 minutes for long-running analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    
    // Handle 403 Forbidden - email not verified
    if (error.response?.status === 403) {
      const data = error.response.data as any;
      if (data?.code === 'EMAIL_NOT_VERIFIED') {
        window.location.href = '/verify-email';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper to handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const response = error.response;
    
    if (!response) {
      return 'Network error. Please check your internet connection.';
    }

    const message = response.data?.message;

    switch (response.status) {
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

export { apiClient };

export const resumeApi = {
  uploadResume: async (file: File): Promise<string> => {
    // Validate file before upload
    if (!file) {
      throw new Error('No file provided');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Resume upload failed');
    }

    // Backend returns: { data: { resume: { id: "...", ... } } }
    const resumeId = response.data.data?.resume?.id;

    if (!resumeId) {
      throw new Error('Upload succeeded but no resume ID was returned');
    }

    return resumeId;
  },


  getAll: async () => {
    const response = await apiClient.get('/resume');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/resume/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/resume/${id}`);
    return response.data;
  },
};
