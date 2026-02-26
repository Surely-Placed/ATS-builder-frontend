import { apiClient } from "@/features/resume/services/resumeService";
import type { ApiResponse, UserResumeDetailInput } from "@/features/analysis/services/v2Types";

export class ResumeDetailsService {
  static async getDetails(): Promise<UserResumeDetailInput | null> {
    try {
      const response = await apiClient.get<ApiResponse<UserResumeDetailInput | null>>(
        "/profile/resume/details"
      );

      const json = response.data;
      if (!json.success) {
        throw new Error(json.message || "Failed to load resume details");
      }

      return json.data ?? null;
    } catch (error: any) {
      // If backend returns 404 or similar, treat as no details yet
      if (error.response?.status === 404) {
        return null;
      }
      const data: ApiResponse<UserResumeDetailInput | null> | undefined = error.response?.data;
      throw new Error(data?.message || error.message || "Failed to load resume details");
    }
  }

  static async saveDetails(input: UserResumeDetailInput): Promise<UserResumeDetailInput> {
    try {
      const response = await apiClient.post<ApiResponse<UserResumeDetailInput>>(
        "/profile/resume/details",
        input
      );

      const json = response.data;
      if (!json.success || !json.data) {
        throw new Error(json.message || "Failed to save resume details");
      }

      return json.data;
    } catch (error: any) {
      const data: ApiResponse<UserResumeDetailInput> | undefined = error.response?.data;
      throw new Error(data?.message || error.message || "Failed to save resume details");
    }
  }
}

