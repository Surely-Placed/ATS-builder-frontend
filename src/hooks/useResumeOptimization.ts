import { useState, useEffect, useCallback, useRef } from 'react';
import AnalysisApiService, { OptimizationResult, JobStatusResponse } from '../services/analysisApi';
import { socketService, JobStatusEvent } from '../services/socketService';
import { useAuth } from '../context/AuthContext';
import { getResumeUrl } from '../utils/resumeUrlHelper';

export interface UseResumeOptimizationOptions {
  analysisId: string;
  onComplete?: (result: any) => void;
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

export function useResumeOptimization({
  analysisId,
  onComplete,
  onError,
  onProgress,
}: UseResumeOptimizationOptions): UseResumeOptimizationReturn {
  const { user } = useAuth();
  const userId = user?.uid || '';
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const jobIdRef = useRef<string | null>(null);
  const statusCallbackRef = useRef<((data: JobStatusEvent) => void) | null>(null);

  // Fetch analysis when optimization completes if we don't have the resume URL
  // This is a fallback in case WebSocket result doesn't include the URL
  useEffect(() => {
    if (status === 'complete' && analysisId && !optimizedResumeUrl && result) {
      // If we don't have the URL yet from WebSocket, fetch it from API
      AnalysisApiService.getAnalysis(analysisId).then((response) => {
        if (response.data?.resume?.optimized_file_url) {
          setOptimizedResumeUrl(response.data.resume.optimized_file_url);
        } else if (response.data?.analysis?.optimized_resume_url) {
          setOptimizedResumeUrl(response.data.analysis.optimized_resume_url);
        }
      }).catch((err) => {
        // Failed to fetch analysis
      });
    }
  }, [status, analysisId, optimizedResumeUrl, result]);

  // Setup WebSocket listener
  useEffect(() => {
    if (!userId) {
      return;
    }

    // Setup job status listener (register before connecting)
    const handleJobStatus = (data: JobStatusEvent) => {
      if (jobIdRef.current && data.jobId === jobIdRef.current) {
        // Update status and progress
        const newStatus = data.status as any;
        const newProgress = data.progress || 0;
        
        setStatus(newStatus);
        setProgress(newProgress);

        if (onProgress) {
          onProgress(data.progress || 0);
        }
        if (data.status === 'complete') {
          setResult(data.result as OptimizationResult);
          
          // Try multiple paths for the optimized resume URL
          const resumeUrl = data.result?.optimized_resume?.file_url || 
                           data.result?.optimized_resume?.pdf_url ||
                           data.result?.pdf_url ||
                           null;
          setOptimizedResumeUrl(resumeUrl);
          
          setStatus('complete');
          
          // Always fetch latest analysis to ensure we have the optimized resume URL
          // This is a fallback in case WebSocket result doesn't include the URL
          if (analysisId) {
            AnalysisApiService.getAnalysis(analysisId).then((response) => {
              const url = response.data?.resume?.optimized_file_url || 
                         response.data?.analysis?.optimized_resume_url ||
                         null;
              if (url) {
                setOptimizedResumeUrl(url);
              }
            }).catch((err) => {
              // Non-critical error - we already have the result from WebSocket
            });
          }
          
          if (onComplete) {
            onComplete(data.result);
          }
        }

        if (data.status === 'failed') {
          const errorMessage = data.error || 'Optimization failed';
          setError(errorMessage);
          setStatus('failed');
          if (onError) {
            onError(errorMessage);
          }
        }
      }
    };

    // Register the listener BEFORE connecting (so it's ready when events arrive)
    statusCallbackRef.current = handleJobStatus;
    socketService.onJobStatus(handleJobStatus);

    // Get Firebase ID token and connect to WebSocket
    const connectWebSocket = async () => {
      try {
        if (!user) {
          setError('User not authenticated');
          setIsConnected(false);
          return;
        }

        // Get Firebase ID token
        const firebaseIdToken = await user.getIdToken();

        // Connect socket with Firebase ID token
        socketService.connect({
          userId: user.uid, // Optional: for logging
          firebaseIdToken: firebaseIdToken, // This will work now!
        });

        setIsConnected(true);
        
        // Re-register listener after connection to ensure it's active
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
      // Don't disconnect - keep connection alive for other components
      // socketService.disconnect();
    };
  }, [userId, user, onComplete, onError, onProgress]);

  // Start optimization
  const startOptimization = useCallback(async () => {
    try {
      setStatus('starting');
      setError(null);
      setProgress(0);
      
      const response = await AnalysisApiService.startOptimization(analysisId);
      jobIdRef.current = response.jobId;
      
      setStatus('running');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to start optimization';
      setError(errorMessage);
      setStatus('failed');
      if (onError) {
        onError(errorMessage);
      }
    }
  }, [analysisId, onError]);

  // Fetch latest analysis data (includes optimized resume URL)
  const fetchAnalysis = useCallback(async () => {
    try {
      const response = await AnalysisApiService.getAnalysis(analysisId);
      if (response.data?.resume?.optimized_file_url) {
        setOptimizedResumeUrl(response.data.resume.optimized_file_url);
      }
      return response.data;
    } catch (err: any) {
      throw err;
    }
  }, [analysisId]);

  // Download optimized resume
  const downloadResume = useCallback(() => {
    try {
      // Try to get URL from state or result
      const resumeData = {
        id: analysisId,
        optimized_file_url: optimizedResumeUrl,
        original_file_url: null,
      };

      // If we have result data, use it
      if (result?.optimized_resume?.file_url) {
        resumeData.optimized_file_url = result.optimized_resume.file_url;
      }

      // Get the proper URL using the helper (handles local storage URLs)
      const url = getResumeUrl(resumeData, {
        preferOptimized: true,
        useProxy: false, // Direct access for local storage URLs
      });

      AnalysisApiService.downloadResume(url, 'optimized-resume.pdf');
    } catch (error: any) {
      setError(error.message || 'No optimized resume available yet');
    }
  }, [optimizedResumeUrl, result, analysisId]);

  return {
    status,
    progress,
    error,
    result,
    optimizedResumeUrl,
    startOptimization,
    fetchAnalysis,
    downloadResume,
    isRunning: status === 'running',
    isComplete: status === 'complete',
    isFailed: status === 'failed',
    isConnected,
  };
}

