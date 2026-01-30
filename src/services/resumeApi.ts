import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { trackResumeUpload, trackResumeDelete, trackConversion } from "../utils/analytics";
import { navigate } from "../utils/navigation";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://api.jobrabbit.ai/api";

// Create axios instance with cookie and token authentication (Safari compatible)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential - allows cookies to be sent with requests
  timeout: 180000, // 3 minutes for long-running analysis
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: handle errors (no token handling here - cookie-based auth only)
apiClient.interceptors.response.use(
  (response) => {
    try {
      const hdr = response.headers && (response.headers['x-usage-remaining'] || response.headers['X-Usage-Remaining']);
      if (typeof hdr !== 'undefined') console.debug('apiClient interceptor: x-usage-remaining ->', hdr);
    } catch (e) {}
    return response;
  },
  (error: AxiosError) => {
    if (!error.response) return Promise.reject(error);
    if (error.response?.status === 401) {
      // For cookie-based auth, just redirect to login on 401
      navigate("/", { replace: true });
    }
    if (error.response?.status === 403) {
      const data = error.response.data as any;
      if (data?.code === "EMAIL_NOT_VERIFIED") {
        navigate("/verify-email", { replace: true });
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
