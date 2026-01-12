import { useEffect, useRef, useState } from 'react';



interface AnalysisStatus {

  analysisId: string;

  status: string;

  atsScoreBefore?: number;

  atsScoreAfter?: number;

  createdAt: Date;

}



interface PollingState {

  [analysisId: string]: {

    isActive: boolean;

    timerId: NodeJS.Timeout | null;

    currentInterval: number;

    lastPollTime: number;

    consecutiveNoChange: number;

  };

}



export const useSmartAnalysisPolling = () => {

  const pollingState = useRef<PollingState>({});

  const [analysisStatus, setAnalysisStatus] = useState<Record<string, AnalysisStatus>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});



  const MIN_INTERVAL = 1000;    // 1 second

  const MAX_INTERVAL = 10000;   // 10 seconds

  const BACKOFF_MULTIPLIER = 1.5;

  const NO_CHANGE_THRESHOLD = 10; // After 10 polls without change, increase interval



  const pollStatus = async (analysisId: string) => {

    const state = pollingState.current[analysisId];

    if (!state || !state.isActive) return;



    const now = Date.now();

    // Throttle to minimum interval

    if (now - state.lastPollTime < MIN_INTERVAL) {

      return;

    }



    try {

      const response = await fetch(`/api/analyze/${analysisId}/status`, {

        headers: { 

          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,

          'Content-Type': 'application/json'

        }

      });



      if (!response.ok) {

        if (response.status === 429) {

          // On rate limit, increase interval significantly

          state.currentInterval = Math.min(state.currentInterval * 2, MAX_INTERVAL);

          return;

        }

        throw new Error(`HTTP ${response.status}`);

      }



      const data: AnalysisStatus = await response.json();

      

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



      // Adjust interval based on status changes

      if (data.status === 'completed' || data.status === 'failed') {

        // Stop polling for completed/failed analyses

        stopPolling(analysisId);

        return;

      }



      // Increase interval gradually if no changes

      if (state.consecutiveNoChange >= NO_CHANGE_THRESHOLD) {

        state.currentInterval = Math.min(state.currentInterval * BACKOFF_MULTIPLIER, MAX_INTERVAL);

        state.consecutiveNoChange = 0; // Reset after increasing interval

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

    const state = pollingState.current[analysisId];

    if (!state || !state.isActive) return;



    state.timerId = setTimeout(() => {

      if (state.isActive) {

        pollStatus(analysisId);

      }

    }, state.currentInterval);

  };



  const startPolling = (analysisId: string) => {

    // Initialize polling state if not exists

    if (!pollingState.current[analysisId]) {

      pollingState.current[analysisId] = {

        isActive: false,

        timerId: null,

        currentInterval: MIN_INTERVAL,

        lastPollTime: 0,

        consecutiveNoChange: 0

      };

    }



    const state = pollingState.current[analysisId];

    

    // Clear any existing timer

    if (state.timerId) {

      clearTimeout(state.timerId);

      state.timerId = null;

    }



    // Reset state for new polling session

    state.isActive = true;

    state.currentInterval = MIN_INTERVAL;

    state.lastPollTime = 0;

    state.consecutiveNoChange = 0;



    // Start polling

    pollStatus(analysisId);

  };



  const stopPolling = (analysisId: string) => {

    const state = pollingState.current[analysisId];

    if (!state) return;



    if (state.timerId) {

      clearTimeout(state.timerId);

      state.timerId = null;

    }

    state.isActive = false;

  };



  const stopAllPolling = () => {

    Object.keys(pollingState.current).forEach(analysisId => {

      stopPolling(analysisId);

    });

  };



  useEffect(() => {

    return () => {

      stopAllPolling();

    };

  }, []);



  return {
    analysisStatus,
    errors,
    startPolling,
    stopPolling,
    getIsPolling: (analysisId: string) => {
      return pollingState.current[analysisId]?.isActive || false;
    }
  };
};