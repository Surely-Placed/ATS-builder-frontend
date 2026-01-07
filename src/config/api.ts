// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api";

// Helper to get auth token
export const getAuthToken = (): string => {
  return localStorage.getItem("token") || "";
};

// Helper to get auth headers
export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});
