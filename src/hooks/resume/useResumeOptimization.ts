import { useState, useCallback, useRef } from 'react';
import { OptimizationService, AnalysisService } from '../../services/analysis';
import { OptimizationResult } from '../../services/analysis/types';
import { useResumeOptimizationWebSocket } from './useResumeOptimizationWebSocket';
import { useResumeDownload } from './useResumeDownload';

export interface UseResumeOptimizationOptions {
  analysisId: string;
  onComplete?: (result: OptimizationResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseResumeOptimizationReturn {
  status: 'idle' | 'starting' | 'running' | 'complete' | 'failed';
  progress: number;
  error: string | null;
  result: OptimizationResult | null;
  optimizedResumeUrl: string | null;
  startOptimization: () => Promise<void>;
  fetchAnalysis: () => Promise<any>;
  downloadResume: () => void;
  isRunning: boolean;
  isComplete: boolean;
  isFailed: boolean;
  isConnected: boolean;
}

/**
 * Main hook for resume optimization that composes WebSocket and download logic
 */
export function useResumeOptimization({
  analysisId,
  onComplete,
  onError,
  onProgress,
}: UseResumeOptimizationOptions): UseResumeOptimizationReturn {
  const [error, setError] = useState<string | null>(null);
  const jobIdRef = useRef<string | null>(null);

  // Use WebSocket hook for real-time updates
  const {
    status: wsStatus,
    progress: wsProgress,
    error: wsError,
    result: wsResult,
    optimizedResumeUrl: wsOptimizedUrl,
    isConnected,
    setJobId,
  } = useResumeOptimizationWebSocket({
    jobId: jobIdRef.current,
    analysisId,
    onComplete,
    onError: (err) => {
      setError(err);
      if (onError) onError(err);
    },
    onProgress,
  });

  // Use download hook
  const { downloadResume } = useResumeDownload({
    analysisId,
    optimizedResumeUrl: wsOptimizedUrl,
    result: wsResult,
  });

  // Start optimization
  const startOptimization = useCallback(async () => {
    try {
      setError(null);
      
      const response = await OptimizationService.startOptimization(analysisId);
      jobIdRef.current = response.jobId;
      setJobId(response.jobId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start optimization';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [analysisId, onError, setJobId]);

  // Fetch latest analysis data
  const fetchAnalysis = useCallback(async () => {
    try {
      const response = await AnalysisService.getAnalysis(analysisId);
      return response.data || response;
    } catch (err: any) {
      throw err;
    }
  }, [analysisId]);

  // Combine WebSocket error with local error state
  const combinedError = wsError || error;
  const combinedStatus = jobIdRef.current ? wsStatus : 'idle';

  return {
    status: combinedStatus,
    progress: wsProgress,
    error: combinedError,
    result: wsResult,
    optimizedResumeUrl: wsOptimizedUrl,
    startOptimization,
    fetchAnalysis,
    downloadResume,
    isRunning: combinedStatus === 'running',
    isComplete: combinedStatus === 'complete',
    isFailed: combinedStatus === 'failed',
    isConnected,
  };
}

// Re-export for backward compatibility
export { useResumeOptimization as default };

