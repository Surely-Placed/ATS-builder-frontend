import React from "react";
import { ResumeOptimizingView } from "@/features/resume/components/ResumeOptimizingView";
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
        setViewState("form");
        // Clear the URL parameters to prevent restoration logic from running (analysis route)
        navigate("/resume-analysis", { replace: true });
      }}
      onComplete={() => {
        setViewState("preview");
        if (analysisId) {
          navigate(`/resume-preview/${analysisId}`, { replace: true });
        }
      }}

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