import axios, { InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../../utils/tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api";

/**
 * Axios instance for analysis API with authentication interceptors
 */
export const analysisApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for cookies (works on all browsers including Safari)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add Authorization header with token (Safari fallback)
analysisApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Extract and store token from responses
analysisApiClient.interceptors.response.use(
  (response) => {
    // ✅ Extract token from response if present (backend may return it)
    // Backend structure: { success: true, data: { token: "...", ... } }
    const token = (response.data as any)?.data?.token || (response.data as any)?.token;
    if (token) {
      tokenStorage.setToken(token);
      // Set in axios defaults for immediate use
      analysisApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - remove token and redirect
    if (error.response?.status === 401) {
      tokenStorage.removeToken();
      // Clear token from axios defaults
      delete analysisApiClient.defaults.headers.common["Authorization"];
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
