import { analysisApiClient } from "./apiClient";
import { PreviewResponse } from "./types";
import { trackPDFGenerate } from '@/utils/analytics';

/**
 * Service for resume preview and PDF generation
 */
export class PreviewService {
  /**
   * Get Resume Preview with Changes
   * GET /api/analyze/:analysisId/preview
   * Uses the correct preview endpoint - does NOT call analyze/optimize
   */
  static async getPreview(analysisId: string): Promise<PreviewResponse["data"]> {
    try {
      const response = await analysisApiClient.get<PreviewResponse>(
        `/analyze/${analysisId}/preview`
      );

      // Handle non-2xx responses (axios throws for non-2xx, but check anyway)
      if (response.status < 200 || response.status >= 300) {
        const errorMessage =
          response.data?.message ||
          (response.data as any)?.error ||
          `Failed to get preview (${response.status})`;

        // Handle specific error cases
        if (response.status === 404) {
          throw new Error("Preview not found. Please run optimization first.");
        } else if (response.status === 403 || response.status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        } else {
          throw new Error(errorMessage);
        }
      }

      // Validate response structure
      if (!response.data.success) {
        throw new Error((response.data as any)?.message || "Failed to get preview");
      }

      // Extract preview data
      const previewData = response.data.data || response.data;

      // Validate preview structure
      if (!previewData || (!previewData.optimized_resume && !previewData.original_resume)) {
        throw new Error("Invalid preview data structure");
      }

      return previewData;
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;

        // Extract error message from response
        const errorMessage = data?.message || data?.error || `Failed to get preview (${status})`;

        // Handle specific error cases
        if (status === 404) {
          throw new Error("Preview not found. Please run optimization first.");
        } else if (status === 403 || status === 401) {
          throw new Error("Unauthorized. Please log in again.");
        } else {
          throw new Error(errorMessage);
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        throw new Error("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        // Handle JSON parse errors
        if (error.name === "SyntaxError") {
          throw new Error("Invalid response from server. Please try again.");
        }

        // Re-throw with original message if it's already an Error
        if (error instanceof Error) {
          throw error;
        }

        // Fallback for unknown errors
        throw new Error(error?.message || "Failed to get preview. Please try again.");
      }
    }
  }

  /**
   * Generate PDF from optimized resume
   * POST /api/analyze/:analysisId/generate-pdf
   */
  static async generatePDF(analysisId: string): Promise<{ success: boolean; file_url: string }> {
    try {
      const response = await analysisApiClient.post<{ success: boolean; file_url: string }>(
        `/analyze/${analysisId}/generate-pdf`
      );

      if (!response.data.success) {
        throw new Error("Failed to generate PDF");
      }

      // Track PDF generation
      trackPDFGenerate(analysisId);

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Failed to generate PDF");
    }
  }
}
