import { analysisApiClient } from "./apiClient";
import { StartAnalysisRequest, AnalysisResponse, AnalysisResult } from "./types";
import { trackAnalysisStart, trackAnalysisComplete, trackConversion } from "../../utils/analytics";
import { normalizeAnalysisResult } from "../../utils/analysisResultNormalizer";
// Cookie-only auth: do not import tokenStorage or use localStorage tokens

/**
 * Service for resume analysis operations
 */
export class AnalysisService {
  /**
   * Quick Analysis (synchronous)
   * POST /api/analyze
   */
  static async analyzeResume(data: StartAnalysisRequest): Promise<AnalysisResult> {
    try {
      // Track analysis start
      trackAnalysisStart(data.resume_id, data.job_title);

      // Rely solely on cookie-based auth. Axios instance is configured with `withCredentials: true`.
      const response = await analysisApiClient.post<AnalysisResponse>("/analyze", data);

      if (!response.data.success) {
        throw new Error("Failed to analyze resume");
      }

      // Normalize the response structure
      const normalizedResult = normalizeAnalysisResult(response.data);

      // Track analysis complete with token usage if available
      const atsScore =
        normalizedResult.ats_analysis?.before?.score ||
        normalizedResult.analysis?.ats_score_before ||
        0;
      const tokenUsage = response.data.token_usage;
      trackAnalysisComplete(data.resume_id, atsScore, data.job_title, tokenUsage);
      trackConversion("analysis");

      return normalizedResult as unknown as AnalysisResult;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Failed to analyze resume");
    }
  }

  /**
   * Get Analysis Details (includes optimized resume URL and ATS scores)
   * GET /api/analyze/:analysisId
   * Returns full analysis with before and after ATS scores
   */
  static async getAnalysis(analysisId: string): Promise<AnalysisResult> {
    try {
      const response = await analysisApiClient.get<AnalysisResponse>(`/analyze/${analysisId}`);

      if (!response.data.success) {
        throw new Error("Failed to get analysis");
      }

      // Normalize the response structure
      const normalizedResult = normalizeAnalysisResult(response.data);

      return normalizedResult as unknown as AnalysisResult;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Failed to get analysis");
    }
  }

  /**
   * Get Analysis Status (lightweight status check for polling)
   * GET /api/analyze/:analysisId/status
   * Falls back to full analysis endpoint if status endpoint doesn't exist
   * Returns status, progress, and completion state
   */
  static async getAnalysisStatus(analysisId: string): Promise<{
    status: string;
    progress: number;
    isCompleted: boolean;
    data?: AnalysisResult;
  }> {
    try {
      // Try the /status endpoint first
      try {
        const response = await analysisApiClient.get<any>(`/analyze/${analysisId}/status`);
        
        const data = response.data?.data || response.data;
        const status = data?.status || 'unknown';
        const progress = data?.progress || 0;
        
        // Check if optimization is complete
        const isCompleted = ['optimization_completed', 'optimization_failed', 'initial_failed'].includes(status);
        
        return {
          status,
          progress,
          isCompleted,
          data: data?.result || undefined,
        };
      } catch (statusError: any) {
        // If 404, fall back to full analysis endpoint
        if (statusError.response?.status === 404) {
          const fullData = await AnalysisService.getAnalysis(analysisId);
          
          // Cast to any to handle dynamic API response structure
          const optimizedResume = (fullData as any)?.optimized_resume;
          
          // Determine completion status from full data
          const isCompleted = !!(
            (optimizedResume && (
              optimizedResume.file_url ||
              optimizedResume.pdf_url ||
              optimizedResume.url
            )) ||
            (fullData?.analysis?.ats_score_after !== null && fullData?.analysis?.ats_score_after !== undefined) ||
            fullData?.ats_analysis?.after
          );
          
          // Calculate progress
          let progress = 0;
          if (isCompleted) {
            progress = 100;
          } else if (fullData?.analysis?.ats_score_before) {
            progress = 50; // Analysis done, optimization pending
          }
          
          return {
            status: isCompleted ? 'optimization_completed' : 'optimization_processing',
            progress,
            isCompleted,
            data: fullData,
          };
        }
        throw statusError;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Failed to get analysis status");
    }
  }
}
