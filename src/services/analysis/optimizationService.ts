import { analysisApiClient } from './apiClient';
import { OptimizationJobResponse, JobStatusResponse } from './types';
import { trackOptimizationStart } from '../../utils/analytics';

/**
 * Service for resume optimization operations
 */
export class OptimizationService {
  /**
   * Start Optimization (async)
   * POST /api/analyze/:analysisId/optimize
   * Handles the optimization request with proper error handling
   */
  static async startOptimization(analysisId: string): Promise<OptimizationJobResponse> {
    try {
      // Track optimization start
      trackOptimizationStart(analysisId);
      
      const response = await analysisApiClient.post<OptimizationJobResponse>(`/analyze/${analysisId}/optimize`);
      
      // Handle non-2xx responses (axios throws for non-2xx, but check anyway)
      if (response.status < 200 || response.status >= 300) {
        const errorMessage = response.data?.message || 
                            (response.data as any)?.error || 
                            `Failed to start optimization (${response.status})`;
        
        // Handle specific error cases
        if (response.status === 404) {
          throw new Error('Analysis not found. Please run analysis first.');
        } else if (response.status === 403 || response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (response.status === 500) {
          throw new Error(response.data?.message || 'Server error. Please try again later.');
        } else {
          throw new Error(errorMessage);
        }
      }

      // Validate response structure
      if (!response.data.success) {
        throw new Error((response.data as any)?.message || 'Failed to start optimization');
      }

      // Extract job ID and analysis ID
      const result = (response.data as any)?.data || response.data;
      
      if (!result.jobId || !result.analysisId) {
        console.error('Invalid optimization response:', result);
        throw new Error('Invalid response from server. Missing job ID.');
      }

      return {
        success: true,
        jobId: result.jobId,
        analysisId: result.analysisId,
      };
    } catch (error: any) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        // Extract error message from response
        const errorMessage = data?.message || 
                            data?.error || 
                            `Failed to start optimization (${status})`;
        
        // Handle specific error cases
        if (status === 404) {
          throw new Error('Analysis not found. Please run analysis first.');
        } else if (status === 403 || status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error(data?.message || 'Server error. Please try again later.');
        } else {
          throw new Error(errorMessage);
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        // Handle JSON parse errors
        if (error.name === 'SyntaxError') {
          throw new Error('Invalid response from server. Please try again.');
        }
        
        // Re-throw with original message if it's already an Error
        if (error instanceof Error) {
          throw error;
        }
        
        // Fallback for unknown errors
        throw new Error(error?.message || 'Failed to start optimization. Please try again.');
      }
    }
  }

  /**
   * Get Optimization Job Status
   * GET /api/analyze/job/:jobId/status
   */
  static async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    try {
      const response = await analysisApiClient.get<JobStatusResponse>(`/analyze/job/${jobId}/status`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get job status');
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get job status');
    }
  }
}

