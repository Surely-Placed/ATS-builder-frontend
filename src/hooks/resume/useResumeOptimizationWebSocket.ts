import { useState, useEffect, useRef, useCallback } from 'react';
import { socketService, JobStatusEvent } from '../../services/socketService';
import { useAuth } from '../../context/AuthContext';
import { OptimizationResult } from '../../services/analysis/types';
import { AnalysisService } from '../../services/analysis';
import { trackOptimizationComplete, trackOptimizationFailed, trackConversion } from '../../utils/analytics';

export interface UseWebSocketOptions {
  jobId: string | null;
  analysisId: string;
  onComplete?: (result: OptimizationResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseWebSocketReturn {
  status: 'idle' | 'starting' | 'running' | 'complete' | 'failed';
  progress: number;
  error: string | null;
  result: OptimizationResult | null;
  optimizedResumeUrl: string | null;
  isConnected: boolean;
  setJobId: (jobId: string | null) => void;
}

/**
 * Hook for managing WebSocket connection and job status updates
 */
export function useResumeOptimizationWebSocket({
  jobId,
  analysisId,
  onComplete,
  onError,
  onProgress,
}: UseWebSocketOptions): UseWebSocketReturn {
  const { user } = useAuth();
  const userId = user?.uid || '';
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const statusCallbackRef = useRef<((data: JobStatusEvent) => void) | null>(null);

  // Extract optimized resume URL from multiple possible locations
  const extractOptimizedUrl = useCallback((optimizationResult: OptimizationResult | any): string | null => {
    return optimizationResult?.optimized_resume?.file_url || 
           optimizationResult?.optimized_resume?.url ||
           optimizationResult?.optimized_resume?.pdf_url ||
           optimizationResult?.analysis?.optimized_file_url ||
           optimizationResult?.pdf_url ||
           null;
  }, []);

  // Fetch optimized URL from API if not available in WebSocket result
  const fetchOptimizedUrl = useCallback(async (analysisId: string) => {
    try {
      const response = await AnalysisService.getAnalysis(analysisId);
      const data = response.data || response;
      
      const url = data?.optimized_resume?.file_url ||
                 data?.optimized_resume?.url ||
                 data?.optimized_resume?.pdf_url ||
                 data?.analysis?.optimized_file_url ||
                 data?.resume?.optimized_file_url ||
                 null;
      
      if (url) {
        setOptimizedResumeUrl(url);
      }
    } catch (err) {
      // Non-critical error - we already have the result from WebSocket
    }
  }, []);

  // Setup WebSocket listener
  useEffect(() => {
    if (!userId) {
      return;
    }

    // Setup job status listener
    const handleJobStatus = (data: JobStatusEvent) => {
      if (jobId && data.jobId === jobId) {
        // Update status and progress
        const newStatus = data.status as any;
        const newProgress = data.progress || 0;
        
        setStatus(newStatus);
        setProgress(newProgress);

        if (onProgress) {
          onProgress(data.progress || 0);
        }

        if (data.status === 'complete') {
          const optimizationResult = data.result as OptimizationResult;
          setResult(optimizationResult);
          
          // Extract optimized resume URL
          const resumeUrl = extractOptimizedUrl(optimizationResult);
          if (resumeUrl) {
            setOptimizedResumeUrl(resumeUrl);
          }
          
          setStatus('complete');
          
          // Track optimization completion
          if (optimizationResult?.analysis) {
            const scoreBefore = optimizationResult.analysis.ats_score_before;
            const scoreAfter = optimizationResult.analysis.ats_score_after;
            const scoreImprovement = optimizationResult.analysis.score_improvement;
            const tokenUsage = data.token_usage || optimizationResult.token_usage;
            
            trackOptimizationComplete(
              analysisId,
              scoreImprovement,
              scoreBefore,
              scoreAfter,
              tokenUsage
            );
            trackConversion('optimization');
          }
          
          // Fetch latest analysis to ensure we have the optimized resume URL
          fetchOptimizedUrl(analysisId);
          
          if (onComplete) {
            onComplete(optimizationResult);
          }
        }

        if (data.status === 'failed') {
          trackOptimizationFailed(analysisId, data.error || 'Unknown error');
          setError(data.error || 'Optimization failed');
          setStatus('failed');
          
          if (onError) {
            onError(data.error || 'Optimization failed');
          }
        }
      }
    };

    // Register the listener
    statusCallbackRef.current = handleJobStatus;
    socketService.onJobStatus(handleJobStatus);

    // Connect to WebSocket
    const connectWebSocket = async () => {
      try {
        if (!user) {
          setError('User not authenticated');
          setIsConnected(false);
          return;
        }

        const firebaseIdToken = await user.getIdToken();
        socketService.connect({
          userId: user.uid,
          firebaseIdToken: firebaseIdToken,
        });

        setIsConnected(true);
        
        // Re-register listener after connection
        if (statusCallbackRef.current) {
          socketService.onJobStatus(statusCallbackRef.current);
        }
      } catch (error) {
        setError('Failed to connect to server');
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // Check connection status periodically
    const checkConnection = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(checkConnection);
      if (statusCallbackRef.current) {
        socketService.offJobStatus(statusCallbackRef.current);
        statusCallbackRef.current = null;
      }
    };
  }, [userId, user, jobId, analysisId, onComplete, onError, onProgress, extractOptimizedUrl, fetchOptimizedUrl]);

  // Fetch optimized URL when status is complete but URL is missing
  useEffect(() => {
    if (status === 'complete' && analysisId && !optimizedResumeUrl && result) {
      fetchOptimizedUrl(analysisId);
    }
  }, [status, analysisId, optimizedResumeUrl, result, fetchOptimizedUrl]);

  const setJobId = useCallback((newJobId: string | null) => {
    // This will trigger the useEffect above to update jobId
  }, []);

  return {
    status,
    progress,
    error,
    result,
    optimizedResumeUrl,
    isConnected,
    setJobId,
  };
}

