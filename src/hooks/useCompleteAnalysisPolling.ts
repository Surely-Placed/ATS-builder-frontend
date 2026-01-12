import { useEffect, useRef, useState } from 'react';

interface AnalysisStatus {
  analysisId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  atsScoreBefore?: number;
  atsScoreAfter?: number;
  createdAt: Date;
}

interface FullAnalysisData {
  analysis: {
    id: string;
    ats_score_before: number | null;
    ats_score_after: number | null;
    quality_score: number | null;
    created_at: Date;
    [key: string]: any;
  };
  ats_analysis?: {
    before?: {
      score: number | null;
      real_score: number | null;
      label: string;
      breakdown?: any;
      matched_skills: string[];
      missing_skills: string[];
    };
    after?: {
      score: number | null;
      real_score: number | null;
      label: string;
      breakdown?: any;
      matched_skills: string[];
      missing_skills: string[];
      improvement?: number;
    };
    ai_insights?: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  };
  resume_quality?: any;
  comprehensive_feedback?: any;
  optimized_resume?: {
    file_url: string;
    [key: string]: any;
  };
  section_analysis?: any;
  breakdown?: any;
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
  hasCompleted: boolean;
  hasFetchedFullData: boolean;
}

export const useCompleteAnalysisPolling = (config: Partial<PollingConfig> = {}) => {
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
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

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
      const response = await fetch(`/api/analyze/${analysisId}/status`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
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
      
      // Update status immediately
      setAnalysisStatus(prev => ({ ...prev, [analysisId]: data }));

      // Check for terminal states
      if (data.status === 'completed' || data.status === 'failed') {
        // Once completed, fetch full analysis data once
        if (!state.hasFetchedFullData) {
          setLoadingStates(prev => ({ ...prev, [analysisId]: true }));
          try {
            const fullResponse = await fetch(`/api/analyze/${analysisId}`, {
              headers: { 
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (fullResponse.ok) {
              const fullData: FullAnalysisData = await fullResponse.json();
              setFullAnalysisData(prev => ({ ...prev, [analysisId]: fullData }));
              state.hasFetchedFullData = true;
            } else {
              throw new Error(`HTTP ${fullResponse.status}`);
            }
          } catch (fullError) {
            console.error('Error fetching full analysis data:', fullError);
            setErrors(prev => ({
              ...prev,
              [analysisId]: `Failed to load full analysis data: ${fullError instanceof Error ? fullError.message : 'Unknown error'}`
            }));
          } finally {
            setLoadingStates(prev => ({ ...prev, [analysisId]: false }));
          }
        }
        
        // Mark as completed and stop polling
        state.hasCompleted = true;
        stopPolling(analysisId);
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
        hasCompleted: false,
        hasFetchedFullData: false
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
    state.hasFetchedFullData = false;

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

  const isDataComplete = (analysisId: string) => {
    const data = fullAnalysisData[analysisId];
    if (!data) return false;
    
    // Check if required fields are present
    return data.analysis && 
           data.ats_analysis &&
           data.ats_analysis.ai_insights &&
           data.resume_quality !== undefined;
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
    loadingStates,
    startPolling,
    stopPolling,
    getIsPolling,
    getFullAnalysisData,
    isDataComplete,
    hasError: (analysisId: string) => !!errors[analysisId],
    isLoading: (analysisId: string) => loadingStates[analysisId] || false,
    clearError: (analysisId: string) => {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[analysisId];
        return newErrors;
      });
    }
  };
};
