import axios, { AxiosError } from "axios";
import { trackResumeUpload, trackResumeDelete, trackConversion } from "@/utils/analytics";
import { navigate } from "@/utils/navigation";
import { API_BASE_URL } from "@/config/api";

// Create axios instance with cookie-based authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: handle errors
apiClient.interceptors.response.use(
  (response) => {
    try {
      const hdr = response.headers && (response.headers['x-usage-remaining'] || response.headers['X-Usage-Remaining']);
      if (typeof hdr !== 'undefined') console.debug('apiClient interceptor: x-usage-remaining ->', hdr);
    } catch (e) { }
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
