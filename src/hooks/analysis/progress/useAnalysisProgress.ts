import { useState, useEffect, useCallback, useRef } from "react";
import AnalysisApiService from "@/services/analysisApi";
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
  const startTimeRef = useRef<number>(0);
  const steps = ANALYSIS_STEPS;
  const totalEstimatedTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);

  const simulateAnalysisProgress = useCallback(async () => {
    if (!analysisParams) return;

    setProgressState({ currentStep: 0, progress: 0, status: "analyzing" });
    startTimeRef.current = Date.now();

    const startAnalysis = async () => {
      try {
        const apiCallPromise = AnalysisApiService.analyzeResume({
          resume_id: analysisParams.resumeId,
          job_description: analysisParams.jobDescription,
          job_title: analysisParams.jobTitle,
        });

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

        if (onComplete) {
          setTimeout(() => onComplete(result), 500);
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
        if (onError) {
          onError(error.message || "Analysis failed");
        }
      }
    };

    startAnalysis();
  }, [analysisParams, steps, totalEstimatedTime, onComplete, onError]);

  useEffect(() => {
    if (analysisParams) {
      simulateAnalysisProgress();
    }
  }, [analysisParams, simulateAnalysisProgress]);

  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  return progressState;
}
