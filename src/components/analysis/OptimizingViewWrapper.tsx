import React from "react";
import { ResumeOptimizingView } from "@/components/resume/ResumeOptimizingView";
import { useToast } from "@/hooks/use-toast";
import { mapOptimizationStatus } from '@/utils/analysis/optimizationStatusMapper';

interface OptimizingViewWrapperProps {
  analysisId: string;
  optimizationStatus: string;
  optimizationProgress: number;
  optimizationError: string | undefined;
  setViewState: (state: string) => void;
  toast: any; // Using any since we're using the toast hook result
  navigate: (path: string, options?: any) => void;
}

export const OptimizingViewWrapper: React.FC<OptimizingViewWrapperProps> = ({
  analysisId,
  optimizationStatus,
  optimizationProgress,
  optimizationError,
  setViewState,
  toast,
  navigate,
}) => {
  const optimizationStatusMapped = mapOptimizationStatus(optimizationStatus);

  const errorToPass =
    optimizationStatus === "failed" ? optimizationError || undefined : undefined;

  return (
    <ResumeOptimizingView
      analysisId={analysisId}
      progress={optimizationProgress}
      status={optimizationStatusMapped}
      error={errorToPass}
      onReset={() => {
        setViewState("analysis");
        // Clear the URL parameters to prevent restoration logic from running (analysis route)
        navigate("/resume-analysis", { replace: true });
      }}
      onComplete={() => setViewState("comparison")}
      onError={(error) => {
        if (optimizationStatus === "failed") {
          toast({
            title: "Optimization Failed",
            description: error,
            variant: "destructive",
          });
        }
      }}
    />
  );
};