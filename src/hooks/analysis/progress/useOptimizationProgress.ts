import { useState, useEffect, useRef } from "react";
import { OPTIMIZATION_STEPS } from "@/constants/analysis/steps";

interface UseOptimizationProgressProps {
  optimizationParams?: {
    analysisId: string;
    jobId?: string;
    progress?: number;
    status?: "optimization_pending" | "optimization_processing" | "optimization_completed" | "optimization_failed";
    error?: string;
  };
  onError?: (error: string) => void;
}

interface ProgressState {
  currentStep: number;
  progress: number;
  status: "idle" | "analyzing" | "optimizing" | "completed" | "failed";
  error?: string;
}

// Map backend progress percentage to step index (0-5 for 6 steps)
const getStepFromProgress = (progress: number, status: string): number => {
  if (status === "optimization_completed") return OPTIMIZATION_STEPS.length - 1; // Last step
  if (status === "optimization_failed") return 0;

  // Map progress 0-100 to step indices 0-5
  // Step 0: 0-16%, Step 1: 17-33%, Step 2: 34-50%, Step 3: 51-66%, Step 4: 67-83%, Step 5: 84-100%
  const stepPercentage = 100 / OPTIMIZATION_STEPS.length;
  const stepIndex = Math.min(
    Math.floor(progress / stepPercentage),
    OPTIMIZATION_STEPS.length - 1
  );
  return stepIndex;
};

export function useOptimizationProgress({
  optimizationParams,
  onError,
}: UseOptimizationProgressProps) {
  const [progressState, setProgressState] = useState<ProgressState>({
    currentStep: 0,
    progress: 0,
    status: "idle",
  });

  const prevStatusRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (optimizationParams) {
      const { progress = 0, status = "optimization_pending", error } = optimizationParams;

      // Use backend progress directly - map to step index for UI display
      const stepIndex = getStepFromProgress(progress, status);
      const statusChanged = prevStatusRef.current !== status;

      if (status === "optimization_failed" && statusChanged) {
        setProgressState({
          currentStep: stepIndex,
          progress,
          status: "failed",
          error: error || "Optimization failed",
        });
        if (onError && error) {
          onError(error);
        }
      } else if (status === "optimization_completed") {
        setProgressState({
          currentStep: OPTIMIZATION_STEPS.length - 1, // Last step
          progress: 100,
          status: "completed",
          error: undefined,
        });
      } else {
        setProgressState({
          currentStep: stepIndex,
          progress,
          status: "optimizing",
          error: undefined,
        });
      }

      prevStatusRef.current = status;
    }
  }, [optimizationParams?.progress, optimizationParams?.status, optimizationParams?.error, onError]);

  return progressState;
}
