import { analysisApiClient } from './apiClient';
import { StartAnalysisRequest, AnalysisResponse, AnalysisResult } from './types';
import { trackAnalysisStart, trackAnalysisComplete, trackConversion } from '../../utils/analytics';
import { normalizeAnalysisResult } from '../../utils/analysisResultNormalizer';

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
      
      const response = await analysisApiClient.post<AnalysisResponse>('/analyze', data);

      if (!response.data.success) {
        throw new Error('Failed to analyze resume');
      }

      // Normalize the response structure
      const normalizedResult = normalizeAnalysisResult(response.data);
      
      // Track analysis complete with token usage if available
      const atsScore = normalizedResult.ats_analysis?.before?.score || normalizedResult.analysis?.ats_score_before || 0;
      const tokenUsage = response.data.token_usage;
      trackAnalysisComplete(data.resume_id, atsScore, data.job_title, tokenUsage);
      trackConversion('analysis');
      
      return normalizedResult as unknown as AnalysisResult;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to analyze resume');
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
        throw new Error('Failed to get analysis');
      }
      
      // Normalize the response structure
      const normalizedResult = normalizeAnalysisResult(response.data);
      
      return normalizedResult as unknown as AnalysisResult;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get analysis');
    }
  }
}
