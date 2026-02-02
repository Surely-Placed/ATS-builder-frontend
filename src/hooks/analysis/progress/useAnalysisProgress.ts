import { useState, useEffect, useCallback, useRef } from "react";
import { AnalysisService } from '@/features/analysis/services/analysisService';
import { ANALYSIS_STEPS, Step } from "@/constants/analysis/steps";

interface UseAnalysisProgressProps {
  analysisParams?: {
    resumeId: string;
    jobDescription: string;
    jobTitle: string;
  };
  onComplete?: (data: any) => void;
  onError?: (error: string) => void;
}

interface ProgressState {
  currentStep: number;
  progress: number;
  status: "idle" | "analyzing" | "optimizing" | "completed" | "failed";
  error?: string;
}

export function useAnalysisProgress({
  analysisParams,
  onComplete,
  onError,
}: UseAnalysisProgressProps) {
  const [progressState, setProgressState] = useState<ProgressState>({
    currentStep: 0,
    progress: 0,
    status: "idle",
  });

  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
  const steps = ANALYSIS_STEPS;
  const totalEstimatedTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);

  // Use refs for callbacks to stabilize simulateAnalysisProgress dependencies
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onComplete, onError]);

  const simulateAnalysisProgress = useCallback(async (params: typeof analysisParams) => {
    if (!params) return;

    setProgressState({ currentStep: 0, progress: 0, status: "analyzing" });
    startTimeRef.current = Date.now();

    const startAnalysis = async () => {
      try {
        // Create an AbortController for this analysis so it can be cancelled
        if (abortControllerRef.current) {
          try { abortControllerRef.current.abort(); } catch (e) { }
        }
        abortControllerRef.current = new AbortController();

        // Call the analysis API (first step)
        const apiCallPromise = AnalysisService.analyzeResume(
          {
            resume_id: params.resumeId,
            job_description: params.jobDescription,
            job_title: params.jobTitle,
          },
          { signal: abortControllerRef.current.signal }
        );

        analysisIntervalRef.current = setInterval(() => {
          const elapsedTime = Date.now() - startTimeRef.current;
          const progressRatio = Math.min(elapsedTime / totalEstimatedTime, 0.92);

          let cumulativeTime = 0;
          let stepIndex = 0;
          for (let i = 0; i < steps.length; i++) {
            cumulativeTime += steps[i].estimatedTime;
            if (elapsedTime <= cumulativeTime) {
              stepIndex = i;
              break;
            }
            stepIndex = i;
          }

          let prevCumulative = 0;
          for (let i = 0; i < stepIndex; i++) {
            prevCumulative += steps[i].estimatedTime;
          }
          const stepProgress = Math.min(
            (elapsedTime - prevCumulative) / steps[stepIndex].estimatedTime,
            1
          );
          const stepPercentage = (stepIndex / steps.length) * 100;
          const currentStepPercentage = (stepProgress / steps.length) * 100;
          const overallProgress = stepPercentage + currentStepPercentage;

          setProgressState({
            currentStep: stepIndex,
            progress: Math.min(overallProgress, 92),
            status: "analyzing",
          });
        }, 100);

        const result = await apiCallPromise;

        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
          analysisIntervalRef.current = null;
        }

        setProgressState({
          currentStep: steps.length - 1,
          progress: 100,
          status: "completed",
        });

        if (onCompleteRef.current) {
          onCompleteRef.current(result);
        }
      } catch (error: any) {
        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
          analysisIntervalRef.current = null;
        }
        setProgressState({
          currentStep: 0,
          progress: 0,
          status: "failed",
          error: error.message || "Analysis failed",
        });
        if (onErrorRef.current) {
          onErrorRef.current(error.message || "Analysis failed");
        }
      }
    };

    startAnalysis();
  }, [steps, totalEstimatedTime]);

  // Use JSON.stringify to ensure effect only runs when params strictly change content-wise
  // This prevents infinite loops from new object references on re-renders
  const paramsString = analysisParams ? JSON.stringify(analysisParams) : "";

  useEffect(() => {
    if (paramsString) {
      const params = JSON.parse(paramsString);
      simulateAnalysisProgress(params);
    }
  }, [paramsString, simulateAnalysisProgress]);

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      if (abortControllerRef.current) {
        try { abortControllerRef.current.abort(); } catch (e) { }
        abortControllerRef.current = null;
      }
    };
  }, []);

  const cancelAnalysis = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      try { abortControllerRef.current.abort(); } catch (e) { }
      abortControllerRef.current = null;
    }
    setProgressState({ currentStep: 0, progress: 0, status: 'idle' });
  }, []);

  return { ...progressState, cancelAnalysis };
}
