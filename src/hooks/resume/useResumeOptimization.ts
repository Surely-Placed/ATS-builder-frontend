import { useState, useCallback, useRef, useEffect } from "react";
import { useResumeAnalysisStorage } from "../../hooks/useResumeAnalysisStorage";
import { OptimizationService, AnalysisService } from "../../services/analysis";
import { OptimizationResult } from "../../services/analysis/types";
import { useAnalysisPolling } from "../../hooks/useAnalysisPolling";
import { useResumeDownload } from "./useResumeDownload";

export interface UseResumeOptimizationOptions {
  analysisId: string;
  onComplete?: (result: OptimizationResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseResumeOptimizationReturn {
  status: "idle" | "starting" | "running" | "complete" | "failed";
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
 * Main hook for resume optimization that composes polling and download logic
 */
export function useResumeOptimization({
  analysisId,
  onComplete,
  onError,
  onProgress,
}: UseResumeOptimizationOptions): UseResumeOptimizationReturn {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'complete' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState<string | null>(null);
  
  // Use refs to prevent stale closures and avoid re-triggering effects
  const hasCheckedInitialState = useRef(false);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  
  // Keep refs updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onComplete, onError]);
  
  const {
    analysisStatus,
    error: pollError,
    progress: pollingProgress,
    startPolling,
    stopPolling,
    isLoading
  } = useAnalysisPolling();
  
  // Check for existing optimization state on initialization - RUN ONLY ONCE
  useEffect(() => {
    if (hasCheckedInitialState.current || !analysisId) return;
    hasCheckedInitialState.current = true;
    
    const { isOptimizationStarted } = useResumeAnalysisStorage();
    
    const checkExistingOptimization = async () => {
      try {
        // Check if optimization was started for this analysis
        const optimizationStarted = isOptimizationStarted(analysisId);
        
        // Fetch the analysis to see the current state
        const analysis: any = await AnalysisService.getAnalysis(analysisId);
        
        // Check if optimization is complete by looking for optimized content
        const hasOptimization = 
          analysis?.optimized_resume?.file_url ||
          analysis?.optimized_resume?.pdf_url ||
          analysis?.optimized_resume?.url ||
          (analysis?.analysis?.ats_score_after !== null && 
           analysis?.analysis?.ats_score_after !== undefined) ||
          analysis?.ats_analysis?.after;
        
        if (hasOptimization) {
          // Optimization is already complete - don't start polling
          hasCompletedRef.current = true;
          setStatus('complete');
          setProgress(100);
          setResult(analysis);
          
          const url = analysis.optimized_resume?.file_url || 
                      analysis.optimized_resume?.pdf_url || 
                      analysis.optimized_resume?.url;
          if (url) {
            setOptimizedResumeUrl(url);
          }
          
          if (onCompleteRef.current) {
            onCompleteRef.current(analysis as any);
          }
          
          // Clean up the started flag from localStorage
          const { setOptimizationStarted } = useResumeAnalysisStorage();
          setOptimizationStarted(analysisId, false);
        } else if (optimizationStarted) {
          // Optimization was started but is not complete, resume polling
          setStatus('running');
          setProgress(50);
          startPolling(analysisId);
        }
        // If neither complete nor started, stay idle
      } catch (err) {
        // If fetching analysis fails, it might not exist yet or there could be network issues
        // Don't start polling automatically
      }
    };
    
    checkExistingOptimization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]); // Only depend on analysisId, not on startPolling
  
  // Handle polling updates - only process when analysisStatus changes
  useEffect(() => {
    // Skip if no status or already completed
    if (!analysisStatus || hasCompletedRef.current) {
      return;
    }
    
    // Check if optimization is complete by looking for optimized content
    const isOptimizationComplete = !!(
      analysisStatus?.optimized_resume?.file_url ||
      analysisStatus?.optimized_resume?.pdf_url ||
      analysisStatus?.optimized_resume?.url ||
      (analysisStatus?.analysis?.ats_score_after !== null && 
       analysisStatus?.analysis?.ats_score_after !== undefined) ||
      analysisStatus?.ats_analysis?.after
    );

    if (isOptimizationComplete) {
      // Mark as completed to prevent further processing
      hasCompletedRef.current = true;
      
      setStatus('complete');
      setResult(analysisStatus);
      setProgress(100);
      
      // Stop polling
      stopPolling();
      
      // Extract optimized resume URL if available
      const optimizedUrl = 
        analysisStatus?.optimized_resume?.file_url ||
        analysisStatus?.optimized_resume?.pdf_url ||
        analysisStatus?.optimized_resume?.url;
        
      if (optimizedUrl) {
        setOptimizedResumeUrl(optimizedUrl);
      }
      
      if (onCompleteRef.current) {
        onCompleteRef.current(analysisStatus);
      }
      
      // Clean up the started flag from localStorage on completion
      if (analysisId) {
        const { setOptimizationStarted } = useResumeAnalysisStorage();
        setOptimizationStarted(analysisId, false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisStatus, analysisId]); // Don't include stopPolling in deps
  
  // Update progress from polling hook
  useEffect(() => {
    if (!hasCompletedRef.current && pollingProgress > 0) {
      setProgress(pollingProgress);
    }
  }, [pollingProgress]);

  // Use download hook
  const { downloadResume } = useResumeDownload({
    analysisId,
    optimizedResumeUrl,
    result,
  });

  // Start optimization
  const startOptimization = useCallback(async () => {
    // Reset completed flag when starting new optimization
    hasCompletedRef.current = false;
    
    try {
      setError(null);
      setStatus('starting');
      setProgress(0);

      const response = await OptimizationService.startOptimization(analysisId);
      
      // Store the fact that optimization started for this analysis ID
      const { setOptimizationStarted } = useResumeAnalysisStorage();
      setOptimizationStarted(analysisId, true);
      
      // Start polling for status updates
      startPolling(analysisId);
      setStatus('running');
      setProgress(10); // Initial progress
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to start optimization";
      setError(errorMessage);
      setStatus('failed');
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      }
    }
  }, [analysisId, startPolling]);

  // Fetch latest analysis data
  const fetchAnalysis = useCallback(async () => {
    try {
      const response = await AnalysisService.getAnalysis(analysisId);
      return response.data || response;
    } catch (err: any) {
      throw err;
    }
  }, [analysisId]);

  // Combine polling error with local error state
  const combinedError = pollError || error;

  return {
    status,
    progress,
    error: combinedError,
    result,
    optimizedResumeUrl,
    startOptimization,
    fetchAnalysis,
    downloadResume,
    isRunning: status === "running",
    isComplete: status === "complete",
    isFailed: status === "failed",
    isConnected: isLoading,
  };
}

// Re-export for backward compatibility
export { useResumeOptimization as default };
