import { useState, useEffect, useRef, useCallback } from 'react';
import { OptimizationService } from '../services/analysis/optimizationService';
import { AnalysisService } from '../services/analysis/analysisService';
import { PollingManager } from '../services/analysis/PollingManager';

export interface UseSafePollingOptions {
  analysisId: string;
  jobId?: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
  pollingInterval?: number;
  maxRetries?: number;
  autoStart?: boolean;
}

export interface UseSafePollingReturn {
  status: 'idle' | 'starting' | 'running' | 'optimization_completed' | 'optimization_failed';
  progress: number;
  error: string | null;
  result: any;
  optimizedResumeUrl: string | null;
  isConnected: boolean;
}

export function useSafePolling({
  analysisId,
  jobId,
  onComplete,
  onError,
  onProgress,
  pollingInterval = 2000,
  maxRetries = 3
  , autoStart = false
}: UseSafePollingOptions): UseSafePollingReturn {
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'optimization_completed' | 'optimization_failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const pollingManager = useRef(PollingManager.getInstance());
  const pollingRef = useRef<number | null>(null);
  const hasAcquiredLock = useRef(false);
  const retryCount = useRef(0);
  const isMounted = useRef(true);
  
  // Cleanup function
  const cleanup = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    if (hasAcquiredLock.current) {
      pollingManager.current.releasePollingLock(analysisId, jobId);
      hasAcquiredLock.current = false;
    }
  }, [analysisId, jobId]);
  
  // Main polling function with 429 handling
  const executePoll = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      let response;
      
      if (jobId) {
        // Use job-based polling
        response = await OptimizationService.getJobStatus(jobId);
      } else if (analysisId) {
        // Use analysis-based polling (fallback)
        response = await AnalysisService.getAnalysis(analysisId);
      } else {
        // No valid ID to poll, wait for a valid ID
        // Schedule next poll if still mounted
        if (isMounted.current) {
          pollingRef.current = window.setTimeout(executePoll, pollingInterval);
        }
        return;
      }

      // Reset retry count on successful request
      retryCount.current = 0;
      
      // Process response based on polling type
      if (jobId) {
        // Type the response as JobStatusResponse
        const jobResponse = response as any; // JobStatusResponse type
        const jobStatus = jobResponse.status;
        const jobProgress = jobResponse.progress || 0;
        
        setProgress(jobProgress);
        if (onProgress) onProgress(jobProgress);
        
        if (jobStatus === 'optimization_completed') {
          setStatus('optimization_completed');
          setResult(jobResponse.result);
          if (jobResponse.result?.optimized_resume?.file_url) {
            setOptimizedResumeUrl(jobResponse.result.optimized_resume.file_url);
          }
          if (onComplete) onComplete(jobResponse.result);
          cleanup();
          return;
        } else if (jobStatus === 'optimization_failed') {
          setStatus('optimization_failed');
          const errMsg = jobResponse.error || 'Optimization failed';
          setError(errMsg);
          if (onError) onError(errMsg);
          cleanup();
          return;
        } else {
          setStatus('running');
        }
      } else {
        // Type the response as AnalysisResult
        const analysisResponse = response as any; // AnalysisResult type
        // For analysis-based polling, check if optimization is complete
        const hasOptimization = 
          analysisResponse?.optimized_resume ||
          (analysisResponse?.analysis?.ats_score_after !== null && 
           analysisResponse?.analysis?.ats_score_after !== undefined) ||
          analysisResponse?.ats_analysis?.after;
          
        if (hasOptimization) {
          setStatus('optimization_completed');
          setResult(analysisResponse);
          if (onComplete) onComplete(analysisResponse);
          cleanup();
          return;
        } else {
          setStatus('running');
          setProgress(prev => Math.min(prev + 1, 90)); // Visual progress for fallback polling
        }
      }
      
      // Schedule next poll if still mounted and not complete
      if (isMounted.current) {
        pollingRef.current = window.setTimeout(executePoll, pollingInterval);
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      
      // Handle 429 specifically
      if (err.response?.status === 429) {
        console.warn('429 received, applying backoff');
        setError('Rate limit exceeded. Retrying...');
        
        // Apply exponential backoff with jitter
        const backoffTime = pollingInterval * Math.pow(2, Math.min(retryCount.current, 5)) + 
                           Math.random() * 1000; // Add jitter
        retryCount.current++;
        
        if (retryCount.current <= maxRetries) {
          pollingRef.current = window.setTimeout(executePoll, backoffTime);
        } else {
          setStatus('optimization_failed');
          setError('Too many requests - optimization may be taking longer than expected');
          if (onError) onError('Rate limit exceeded');
          cleanup();
        }
      } else {
        // Other errors
        retryCount.current++;
        if (retryCount.current <= maxRetries) {
          console.warn(`Polling error (attempt ${retryCount.current}):`, err.message);
          pollingRef.current = window.setTimeout(executePoll, pollingInterval);
        } else {
          setStatus('optimization_failed');
          setError(err.message || 'Failed to get status');
          if (onError) onError(err.message || 'Failed to get status');
          cleanup();
        }
      }
    }
  }, [analysisId, jobId, pollingInterval, maxRetries, onComplete, onError, onProgress]);
  
  // Initialize polling (only if autoStart is enabled)
  useEffect(() => {
    if (!autoStart) {
      // Do not initiate any network activity until user opts in
      return;
    }
    isMounted.current = true;
    setIsConnected(true);
      
    const startPolling = async () => {
      // Try to acquire polling lock
      const canPoll = await pollingManager.current.acquirePollingLock(analysisId, jobId);
        
      if (!canPoll) {
        // Another poller is active, check status periodically
        setStatus('running');
        setProgress(5); // Show that polling is happening elsewhere
          
        // Periodically check if the other poller completed
        const checkInterval = setInterval(async () => {
          if (!isMounted.current) return;
            
          try {
            let response;
            if (jobId) {
              response = await OptimizationService.getJobStatus(jobId);
            } else if (analysisId) {
              response = await AnalysisService.getAnalysis(analysisId);
            } else {
              // No valid ID to check, continue waiting
              return;
            }
              
            if (jobId) {
              // Type the response as JobStatusResponse
              const jobResponse = response as any;
              if (jobResponse.status === 'optimization_completed') {
                setStatus('optimization_completed');
                setResult(jobResponse.result);
                if (onComplete) onComplete(jobResponse.result);
                clearInterval(checkInterval);
              } else if (jobResponse.status === 'optimization_failed') {
                setStatus('optimization_failed');
                const errMsg = jobResponse.error || 'Optimization failed';
                setError(errMsg);
                if (onError) onError(errMsg);
                clearInterval(checkInterval);
              }
            } else {
              // Type the response as AnalysisResult
              const analysisResponse = response as any;
              const hasOptimization = 
                analysisResponse?.optimized_resume ||
                (analysisResponse?.analysis?.ats_score_after !== null && 
                 analysisResponse?.analysis?.ats_score_after !== undefined) ||
                analysisResponse?.ats_analysis?.after;
                  
              if (hasOptimization) {
                setStatus('optimization_completed');
                setResult(analysisResponse);
                if (onComplete) onComplete(analysisResponse);
                clearInterval(checkInterval);
              }
            }
          } catch (err) {
            // If we can't check status, continue waiting
          }
        }, 5000); // Check every 5 seconds
          
        return () => clearInterval(checkInterval);
      }
        
      // We acquired the lock, start actual polling
      hasAcquiredLock.current = true;
      setStatus('running');
      executePoll();
    };
      
    startPolling();
      
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [analysisId, jobId, executePoll, onComplete, onError, autoStart]);
  
  return {
    status,
    progress,
    error,
    result,
    optimizedResumeUrl,
    isConnected
  };
}