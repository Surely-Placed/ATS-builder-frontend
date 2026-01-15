import { useState, useCallback, useRef, useEffect } from "react";

import { OptimizationService, AnalysisService } from "../../services/analysis";
import { OptimizationResult } from "../../services/analysis/types";
import { useAnalysisPolling } from "../../hooks/useAnalysisPolling";
import { useResumeDownload } from "./useResumeDownload";
import { useUsage } from '@/context/UsageContext';

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
  cancelOptimization: () => void;
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

  const usageCtx = useUsage();
  
  // Do not fetch existing optimization state automatically. Callers can use `fetchAnalysis()` when desired.
  
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
      
      // Resume header updates now that optimization is complete so usage reflects server state
      try {
        usageCtx.resumeHeaderUpdates();
      } catch (e) {
        // ignore
      }
      // No localStorage cleanup
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
    // Prevent concurrent starts
    if ((startOptimization as any)._inFlight) return;
    (startOptimization as any)._inFlight = true;
    // Reset completed flag when starting new optimization
    hasCompletedRef.current = false;
    
    try {
      setError(null);
      setStatus('starting');
      setProgress(0);

      // Suspend header-based usage updates while the optimization is in-flight so the UI doesn't
      // immediately decrement the free-trial count. We'll resume updates when optimization completes.
      try {
        usageCtx.suspendHeaderUpdates();
      } catch (e) {
        // ignore if usage context not available
      }

      const response = await OptimizationService.startOptimization(analysisId);
      
      // No localStorage logic
      
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
      // Intentionally DO NOT resume header updates here. We only resume
      // updates when the server reports the optimization is completed so
      // that the free-trial count is not decreased while optimization is
      // in-flight. Resuming here could allow an intermediate response to
      // update usage prematurely.
      (startOptimization as any)._inFlight = false;
    }
  }, [analysisId, startPolling, usageCtx]);

  const cancelOptimization = useCallback(() => {
    try {
      // Stop polling and reset state
      stopPolling();
    } catch (e) {
      // ignore
    }
    hasCompletedRef.current = false;
    setStatus('idle');
    setProgress(0);
    setError(null);
    setResult(null);
    setOptimizedResumeUrl(null);
    try {
      usageCtx.resumeHeaderUpdates();
    } catch (e) {
      // ignore
    }
  }, [stopPolling, usageCtx]);

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

  // If polling reports an error (e.g., optimization failed), ensure header updates are resumed
  // NOTE: We deliberately avoid resuming header updates on polling errors
  // since the authoritative usage should only be fetched once the
  // optimization completes. This prevents accidental decrements while the
  // operation is still being processed.

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
    cancelOptimization,
  };
}

// Re-export for backward compatibility
export { useResumeOptimization as default };
