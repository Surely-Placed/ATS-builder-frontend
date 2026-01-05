import { useState, useEffect, useRef } from 'react';
import { OPTIMIZATION_STEPS } from '@/constants/analysis/steps';

interface UseOptimizationProgressProps {
  optimizationParams?: {
    analysisId: string;
    jobId?: string;
    progress?: number;
    status?: 'pending' | 'running' | 'complete' | 'failed';
    error?: string;
  };
  onError?: (error: string) => void;
}

interface ProgressState {
  currentStep: number;
  progress: number;
  status: 'idle' | 'analyzing' | 'optimizing' | 'completed' | 'failed';
  error?: string;
}

export function useOptimizationProgress({
  optimizationParams,
  onError,
}: UseOptimizationProgressProps) {
  const [progressState, setProgressState] = useState<ProgressState>({
    currentStep: 0,
    progress: 0,
    status: 'idle',
  });

  const prevStatusRef = useRef<string | undefined>(undefined);
  const steps = OPTIMIZATION_STEPS;

  useEffect(() => {
    if (optimizationParams) {
      const { progress = 0, status = 'pending', error } = optimizationParams;

      // Map progress percentage to step index
      let stepIndex = 0;
      if (progress >= 95) stepIndex = steps.length - 1;
      else if (progress >= 85) stepIndex = 8;
      else if (progress >= 80) stepIndex = 7;
      else if (progress >= 70) stepIndex = 6;
      else if (progress >= 60) stepIndex = 5;
      else if (progress >= 50) stepIndex = 4;
      else if (progress >= 40) stepIndex = 3;
      else if (progress >= 30) stepIndex = 2;
      else if (progress >= 20) stepIndex = 1;
      else stepIndex = 0;

      const statusChanged = prevStatusRef.current !== status;

      if (status === 'failed' && statusChanged) {
        setProgressState({
          currentStep: stepIndex,
          progress,
          status: 'failed',
          error: error || 'Optimization failed',
        });
        if (onError && error) {
          onError(error);
        }
      } else if (status === 'complete') {
        setProgressState({
          currentStep: steps.length - 1,
          progress: 100,
          status: 'completed',
          error: undefined,
        });
      } else {
        setProgressState({
          currentStep: stepIndex,
          progress,
          status: 'optimizing',
          error: undefined,
        });
      }

      prevStatusRef.current = status;
    }
  }, [optimizationParams, steps, onError]);

  return progressState;
}

