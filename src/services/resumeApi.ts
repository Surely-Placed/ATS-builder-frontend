import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { trackResumeUpload, trackResumeDelete, trackConversion } from "../utils/analytics";
import { tokenStorage } from "../utils/tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api";

// Create axios instance with cookie and token authentication (Safari compatible)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential - allows cookies to be sent with requests
  timeout: 180000, // 3 minutes for long-running analysis
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add Authorization header with token (Safari fallback)
apiClient.interceptors.request.use(
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

// Response interceptor: Extract and store token, handle errors
apiClient.interceptors.response.use(
  (response) => {
    // ✅ Extract token from response if present (backend may return it)
    // Backend structure: { success: true, data: { token: "...", ... } }
    const token = (response.data as any)?.data?.token || (response.data as any)?.token;
    if (token) {
      tokenStorage.setToken(token);
      // Set in axios defaults for immediate use
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle network errors (no response received)
    if (!error.response) {
      // Don't redirect on network errors - let the component handle it
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      tokenStorage.removeToken();
      // Clear token from axios defaults
      delete apiClient.defaults.headers.common["Authorization"];
      window.location.href = "/";
    }

    // Handle 403 Forbidden - email not verified
    if (error.response?.status === 403) {
      const data = error.response.data as any;
      if (data?.code === "EMAIL_NOT_VERIFIED") {
        window.location.href = "/verify-email";
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
      throw new Error("No file provided");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Resume upload failed");
    }

    // Backend returns: { success: true, data: { id: "...", ... } }
    const resumeId = response.data.data?.id;

    if (!resumeId) {
      throw new Error("Upload succeeded but no resume ID was returned");
    }

    // Track analytics event
    trackResumeUpload(file.size, file.name);
    trackConversion("resume_upload");

    return resumeId;
  },

  getAll: async () => {
    const response = await apiClient.get("/resume");
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
