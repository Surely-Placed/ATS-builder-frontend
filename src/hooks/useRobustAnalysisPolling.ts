import { useEffect, useRef, useState } from 'react';

interface AnalysisStatus {
  analysisId: string;
  status: 'initial_processed' | 'initial_failed' | 'optimization_pending' | 'optimization_processing' | 'optimization_completed' | 'optimization_failed';
  atsScoreBefore?: number;
  atsScoreAfter?: number;
  createdAt: Date;
}

interface FullAnalysisData {
  analysis: AnalysisStatus;
  // other fields like quality_score, resume_quality, etc.
  [key: string]: any;
}

interface PollingConfig {
  maxPolls: number;
  timeoutMs: number;
  initialInterval: number;
  maxInterval: number;
  backoffMultiplier: number;
  noChangeThreshold: number;
}

interface PollingState {
  isActive: boolean;
  timerId: NodeJS.Timeout | null;
  currentInterval: number;
  lastPollTime: number;
  consecutiveNoChange: number;
  pollCount: number;
  startTime: number;
  hasCompleted: boolean; // Track if analysis has completed
}

export const useOptimizedAnalysisPolling = (config: Partial<PollingConfig> = {}) => {
  const defaultConfig: PollingConfig = {
    maxPolls: 100,
    timeoutMs: 300000, // 5 minutes
    initialInterval: 1000,
    maxInterval: 10000,
    backoffMultiplier: 1.5,
    noChangeThreshold: 10,
    ...config
  };

  const pollingStates = useRef<Record<string, PollingState>>({});
  const [analysisStatus, setAnalysisStatus] = useState<Record<string, AnalysisStatus>>({});
  const [fullAnalysisData, setFullAnalysisData] = useState<Record<string, FullAnalysisData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get API base URL from env or fallback
  const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin + '/api' : '/api');

  const pollStatus = async (analysisId: string) => {
    const state = pollingStates.current[analysisId];
    if (!state || !state.isActive) return;

    // Check timeout
    if (Date.now() - state.startTime > defaultConfig.timeoutMs) {
      setErrors(prev => ({
        ...prev,
        [analysisId]: 'Analysis timed out. Please try again.'
      }));
      stopPolling(analysisId);
      return;
    }

    // Check max polls
    if (state.pollCount >= defaultConfig.maxPolls) {
      setErrors(prev => ({
        ...prev,
        [analysisId]: `Maximum polling attempts (${defaultConfig.maxPolls}) reached.`
      }));
      stopPolling(analysisId);
      return;
    }

    const now = Date.now();
    // Throttle to minimum interval
    if (now - state.lastPollTime < defaultConfig.initialInterval) {
      scheduleNextPoll(analysisId);
      return;
    }

    try {
      // Use the dedicated status endpoint for polling
      const statusUrl = API_BASE_URL.replace(/\/+$/, '') + `/analyze/${analysisId}/status`;
      const response = await fetch(statusUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        if (response.status === 429) {
          // On rate limit, increase interval significantly
          state.currentInterval = Math.min(state.currentInterval * 2, defaultConfig.maxInterval);
          scheduleNextPoll(analysisId);
          return;
        }
        if (response.status === 404) {
          // Analysis not found
          setErrors(prev => ({
            ...prev,
            [analysisId]: 'Analysis not found.'
          }));
          stopPolling(analysisId);
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AnalysisStatus = await response.json();
      
      // Check for terminal states
      if (data.status === 'optimization_completed' || data.status === 'optimization_failed' || data.status === 'initial_failed') {
        // Once completed, fetch full analysis data once
        if (!state.hasCompleted) {
          try {
            const fullUrl = API_BASE_URL.replace(/\/+$/, '') + `/analyze/${analysisId}`;
            const fullResponse = await fetch(fullUrl, {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            });
            
            if (fullResponse.ok) {
              const fullData: FullAnalysisData = await fullResponse.json();
              setFullAnalysisData(prev => ({ ...prev, [analysisId]: fullData }));
            }
          } catch (fullError) {
            console.error('Error fetching full analysis data:', fullError);
          }
          
          state.hasCompleted = true;
        }
        
        setAnalysisStatus(prev => ({ ...prev, [analysisId]: data }));
        stopPolling(analysisId); // Stop polling when terminal state reached
        return;
      }

      // Check if status changed
      const prevStatus = analysisStatus[analysisId];
      const statusChanged = !prevStatus || 
        prevStatus.status !== data.status || 
        prevStatus.atsScoreBefore !== data.atsScoreBefore ||
        prevStatus.atsScoreAfter !== data.atsScoreAfter;

      if (statusChanged) {
        setAnalysisStatus(prev => ({ ...prev, [analysisId]: data }));
        state.consecutiveNoChange = 0; // Reset counter on change
      } else {
        state.consecutiveNoChange++;
      }

      state.lastPollTime = now;
      state.pollCount++;

      // Increase interval gradually if no changes
      if (state.consecutiveNoChange >= defaultConfig.noChangeThreshold) {
        state.currentInterval = Math.min(
          state.currentInterval * defaultConfig.backoffMultiplier, 
          defaultConfig.maxInterval
        );
        state.consecutiveNoChange = 0;
      }

      // Schedule next poll
      scheduleNextPoll(analysisId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [analysisId]: errorMsg }));
      stopPolling(analysisId);
    }
  };

  const scheduleNextPoll = (analysisId: string) => {
    const state = pollingStates.current[analysisId];
    if (!state || !state.isActive) return;

    state.timerId = setTimeout(() => {
      if (state.isActive) {
        pollStatus(analysisId);
      }
    }, state.currentInterval);
  };

  const startPolling = (analysisId: string) => {
    // Initialize polling state if not exists
    if (!pollingStates.current[analysisId]) {
      pollingStates.current[analysisId] = {
        isActive: false,
        timerId: null,
        currentInterval: defaultConfig.initialInterval,
        lastPollTime: 0,
        consecutiveNoChange: 0,
        pollCount: 0,
        startTime: Date.now(),
        hasCompleted: false
      };
    }

    const state = pollingStates.current[analysisId];
    
    // Clear any existing timer
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }

    // Reset state for new polling session
    state.isActive = true;
    state.currentInterval = defaultConfig.initialInterval;
    state.lastPollTime = 0;
    state.consecutiveNoChange = 0;
    state.pollCount = 0;
    state.startTime = Date.now();
    state.hasCompleted = false;

    // Start polling
    pollStatus(analysisId);
  };

  const stopPolling = (analysisId: string) => {
    const state = pollingStates.current[analysisId];
    if (!state) return;

    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
    state.isActive = false;
  };

  const stopAllPolling = () => {
    Object.keys(pollingStates.current).forEach(analysisId => {
      stopPolling(analysisId);
    });
  };

  const getIsPolling = (analysisId: string) => {
    return pollingStates.current[analysisId]?.isActive || false;
  };

  const getFullAnalysisData = (analysisId: string) => {
    return fullAnalysisData[analysisId];
  };

  useEffect(() => {
    return () => {
      stopAllPolling();
    };
  }, []);

  return {
    analysisStatus,
    fullAnalysisData,
    errors,
    startPolling,
    stopPolling,
    getIsPolling,
    getFullAnalysisData,
    hasError: (analysisId: string) => !!errors[analysisId],
    clearError: (analysisId: string) => {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[analysisId];
        return newErrors;
      });
    }
  };
};