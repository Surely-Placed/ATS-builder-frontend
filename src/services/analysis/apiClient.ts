import { apiClient } from "../resumeApi";

// Re-export the shared axios instance used throughout the app so all API calls
// (resume, analysis, etc.) use the same interceptors and auth behavior.
export const analysisApiClient = apiClient;
