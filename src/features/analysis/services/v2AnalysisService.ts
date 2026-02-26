import { analysisApiClient } from "./apiClient";
import type { ApiResponse, AnalyzeResult, PdfResult, AnalysisDetail } from "./v2Types";

/**
 * V2 analysis service (profile‑based, no file upload).
 * Endpoints:
 *  - POST /api/analyze/v2
 *  - POST /api/analyze/v2/pdf
 *  - GET  /api/analyze/v2/:id
 */
export class V2AnalysisService {
  static async analyze(
    jobTitle: string,
    jobDescription: string,
    options?: { signal?: AbortSignal }
  ): Promise<AnalyzeResult> {
    try {
      const response = await analysisApiClient.post<ApiResponse<AnalyzeResult>>(
        "/analyze/v2/custom",
        {
          job_title: jobTitle,
          job_description: jobDescription,
        },
        {
          signal: options?.signal,
        }
      );

      const json = response.data;

      if (!json.success || !json.data) {
        const message = json.message || "Analysis failed";
        throw new Error(message);
      }

      return json.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data: ApiResponse<AnalyzeResult> | undefined = error.response?.data;

      if (status === 400) {
        throw new Error(data?.message || "Job title and description are required");
      }
      if (status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      if (status === 403) {
        throw new Error(
          data?.message || "Your analysis limit has been reached. Please upgrade your plan."
        );
      }
      if (status === 500 && data?.message) {
        throw new Error(data.message);
      }

      throw new Error(error.message || "Failed to run analysis");
    }
  }

  static async generatePdf(analysisId: string): Promise<PdfResult> {
    try {
      const response = await analysisApiClient.post<ApiResponse<PdfResult>>(
        "/analyze/v2/pdf",
        {
          analysis_id: analysisId,
        }
      );

      const json = response.data;

      if (!json.success || !json.data) {
        const message = json.message || "PDF generation failed";
        throw new Error(message);
      }

      return json.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data: ApiResponse<PdfResult> | undefined = error.response?.data;

      if (status === 400) {
        throw new Error(data?.message || "Analysis ID is required");
      }
      if (status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      if (status === 404) {
        throw new Error(data?.message || "Analysis not found for this user");
      }

      throw new Error(error.message || "Failed to generate PDF");
    }
  }

  /** Fetch a single V2 analysis by id (GET /api/analyze/v2/:id) */
  static async getAnalysis(id: string): Promise<AnalysisDetail> {
    try {
      const response = await analysisApiClient.get<ApiResponse<AnalysisDetail>>(
        `/analyze/v2/${id}`
      );

      const json = response.data;

      if (!json.success || !json.data) {
        const message = json.message || "Analysis not found";
        throw new Error(message);
      }

      return json.data;
    } catch (error: any) {
      const status = error.response?.status;
      const data: ApiResponse<AnalysisDetail> | undefined = error.response?.data;

      if (status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      if (status === 404) {
        throw new Error(data?.message || "Analysis not found for this user");
      }

      throw new Error(error.message || "Failed to load analysis");
    }
  }
}

