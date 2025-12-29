import axios, { AxiosError } from 'axios';
import { trackResumeUpload, trackResumeDelete, trackConversion } from '../utils/analytics';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api';

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

    // Track analytics event
    trackResumeUpload(file.size, file.name);
    trackConversion('resume_upload');

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
    trackResumeDelete(id);
    return response.data;
  },
};
