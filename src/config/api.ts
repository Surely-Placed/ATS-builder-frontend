// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api";

// Helper to get auth token
// Cookie-based auth: do not read tokens from localStorage or send Authorization headers
export const getAuthToken = (): string => "";
export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});
