import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ProgressTracker } from "@/features/analysis/components/ProgressTracker";
import { X } from "lucide-react";

interface ResumeOptimizingViewProps {
  analysisId: string;
  progress: number;
  status: "optimization_pending" | "optimization_processing" | "optimization_completed" | "optimization_failed";
  error: string | undefined;
  onReset: () => void;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
}

export const ResumeOptimizingView: React.FC<ResumeOptimizingViewProps> = ({
  analysisId,
  progress,
  status,
  error,
  onReset,
  onComplete,
  onError,
}) => {
  // Memoize optimizationParams to prevent unnecessary re-renders
  const optimizationParams = useMemo(() => ({
    analysisId,
    progress,
    status,
    error,
  }), [analysisId, progress, status, error]);

  return (
    <div className="resume-analysis-flow relative w-full px-2 sm:px-4 md:px-0">
      {/* Reset Button - Top Right */}
      <Button 
        onClick={onReset} 
        variant="outline" 
        size="sm" 
        className="absolute top-0 right-2 sm:right-0 z-10 text-xs sm:text-sm"
      >
        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Reset</span>
        <span className="sm:hidden">×</span>
      </Button>

      <div className="optimizing-view pt-10 sm:pt-8">
        <ProgressTracker
          type="optimization"
          optimizationParams={optimizationParams}
          onComplete={onComplete}
          onError={onError}
        />
        {error && (
          <Button onClick={onReset} variant="outline" className="mt-4 w-full text-sm sm:text-base">
            ← Go Back to Analysis
          </Button>
        )}
      </div>
    </div>
  );
};
