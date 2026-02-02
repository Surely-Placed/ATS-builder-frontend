import { useEffect, useRef, useState } from 'react';
import { AnalysisService } from '../services/analysisService';
import { OptimizationService } from '../services/optimizationService';

interface AnalysisStatus {
  analysisId: string;
  status: string;
  atsScoreBefore?: number;
  atsScoreAfter?: number;
  createdAt: Date;
}

interface PollingManager {
  isActive: boolean;
  currentInterval: number;
  lastCallTime: number;
  hasCompleted: boolean; // Track if already completed
  pollCount: number; // Track number of polls
}

const MAX_POLLS = 60; // Maximum number of polling attempts (reduced)
const POLL_TIMEOUT_MS = 180000; // 3 minutes timeout (reduced)
const MIN_POLL_INTERVAL = 3000; // Minimum 3 seconds between polls
const INITIAL_POLL_INTERVAL = 3000; // Start with 3 seconds
const MAX_POLL_INTERVAL = 15000; // Max 15 seconds between polls

export const useAnalysisPolling = () => {
  const [analysisStatus, setAnalysisStatus] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const pollingRef = useRef<PollingManager>({
    isActive: false,
    currentInterval: INITIAL_POLL_INTERVAL,
    lastCallTime: 0,
    hasCompleted: false,
    pollCount: 0
  });
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const currentAnalysisId = useRef<string | null>(null);
  const currentJobId = useRef<string | null>(null);

  // Smart polling function with exponential backoff
  const pollStatus = async (analysisId: string, jobId?: string) => {
    // CRITICAL: Check if polling should stop
    if (!pollingRef.current.isActive || pollingRef.current.hasCompleted) {
      return;
    }

    // Check timeout
    if (Date.now() - startTimeRef.current > POLL_TIMEOUT_MS) {
      setError('Polling timed out. Please refresh the page.');
      stopPolling();
      return;
    }

    // Check max polls
    if (pollingRef.current.pollCount >= MAX_POLLS) {
      setError('Maximum polling attempts reached. Please refresh the page.');
      stopPolling();
      return;
    }

    pollingRef.current.pollCount++;

    try {
      // Throttle requests to minimum interval
      const now = Date.now();
      const timeSinceLastCall = now - pollingRef.current.lastCallTime;
      if (timeSinceLastCall < MIN_POLL_INTERVAL) {
        // Wait for remaining time before polling
        const waitTime = MIN_POLL_INTERVAL - timeSinceLastCall;
        if (pollingRef.current.isActive && !pollingRef.current.hasCompleted) {
          pollingTimerRef.current = setTimeout(
            () => executePolling(),
            waitTime
          );
        }
        return;
      }
      pollingRef.current.lastCallTime = now;

      let data;
      let isCompleted = false;

      if (jobId) {
        // Poll job status
        data = await OptimizationService.getJobStatus(jobId);
        isCompleted = data.status === 'optimization_completed' || data.status === 'optimization_failed';
        setProgress(Math.min(data.progress || 0, 100));
      } else {
        // Poll analysis status using the /status endpoint (lightweight)
        const statusResult = await AnalysisService.getAnalysisStatus(analysisId);
        isCompleted = statusResult.isCompleted;
        setProgress(statusResult.progress);

        // If completed, fetch full analysis data
        if (isCompleted && statusResult.status === 'optimization_completed') {
          data = await AnalysisService.getAnalysis(analysisId);
        } else {
          // Use status data or set placeholder
          data = statusResult.data || { status: statusResult.status, progress: statusResult.progress };
        }
      }

      setAnalysisStatus(data);

      // CRITICAL: Stop polling if complete
      if (isCompleted) {
        setProgress(100);
        pollingRef.current.hasCompleted = true;
        stopPolling();
        return; // EXIT HERE - no more polling
      }

      // Gradually increase polling interval for long-running operations
      pollingRef.current.currentInterval = Math.min(
        pollingRef.current.currentInterval * 1.5,
        MAX_POLL_INTERVAL
      );

      // Schedule next poll ONLY if not completed
      if (pollingRef.current.isActive && !pollingRef.current.hasCompleted) {
        pollingTimerRef.current = setTimeout(
          () => executePolling(),
          pollingRef.current.currentInterval
        );
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        // On rate limit, increase interval and continue
        pollingRef.current.currentInterval = Math.min(
          pollingRef.current.currentInterval * 2,
          15000
        );

        // Schedule next poll with new interval
        if (pollingRef.current.isActive && !pollingRef.current.hasCompleted) {
          pollingTimerRef.current = setTimeout(
            () => executePolling(),
            pollingRef.current.currentInterval
          );
        }
        return;
      }

      setError(err instanceof Error ? err.message : (err.message || 'Unknown error'));
      stopPolling();
    }
  };

  const executePolling = async () => {
    if (!pollingRef.current.isActive || pollingRef.current.hasCompleted) return;

    const analysisId = currentAnalysisId.current;
    const jobId = currentJobId.current;

    if (analysisId) {
      await pollStatus(analysisId, jobId);
    }
  };

  const startPolling = (analysisId: string, jobId?: string) => {
    // Stop any existing polling
    stopPolling();

    // Set the IDs to poll
    currentAnalysisId.current = analysisId;
    currentJobId.current = jobId;

    // Reset polling state
    pollingRef.current.isActive = true;
    pollingRef.current.currentInterval = INITIAL_POLL_INTERVAL;
    pollingRef.current.hasCompleted = false;
    pollingRef.current.pollCount = 0;
    startTimeRef.current = Date.now();

    // Start polling after initial delay (not immediately)
    pollingTimerRef.current = setTimeout(() => executePolling(), INITIAL_POLL_INTERVAL);
  };

  const stopPolling = () => {
    pollingRef.current.isActive = false;
    if (pollingTimerRef.current) {
      clearTimeout(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    analysisStatus,
    error,
    progress,
    startPolling,
    stopPolling,
    isLoading: pollingRef.current.isActive && !pollingRef.current.hasCompleted
  };
};

export interface UseAnalysisPollingReturn {
  analysisStatus: any | null;
  error: string | null;
  progress: number;
  startPolling: (analysisId: string, jobId?: string) => void;
  stopPolling: () => void;
  isLoading: boolean;
}