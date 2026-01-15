import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { ANALYSIS_STEPS, OPTIMIZATION_STEPS } from "@/constants/analysis/steps";
import { useAnalysisProgress } from "@/hooks/analysis/progress/useAnalysisProgress";
import { useOptimizationProgress } from "@/hooks/analysis/progress/useOptimizationProgress";
import { ProgressCircle } from "./ProgressCircle";
import { CurrentStepCard } from "./CurrentStepCard";
import { StepsList } from "./StepsList";
import { StatusMessage } from "./StatusMessage";

interface ProgressTrackerProps {
  type: "analysis" | "optimization";
  onComplete?: (data: any) => void;
  onError?: (error: string) => void;
  analysisParams?: {
    resumeId: string;
    jobDescription: string;
    jobTitle: string;
  };
  optimizationParams?: {
    analysisId: string;
    jobId?: string;
    progress?: number;
    status?: "optimization_pending" | "optimization_processing" | "optimization_completed" | "optimization_failed";
    error?: string;
  };
  onCancelAvailable?: (cancel: () => void) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  type,
  onComplete,
  onError,
  analysisParams,
  optimizationParams,
  onCancelAvailable,
}) => {
  const analysisProgressRaw = useAnalysisProgress({
    analysisParams: type === "analysis" ? analysisParams : undefined,
    onComplete,
    onError,
  });

  const optimizationProgress = useOptimizationProgress({
    optimizationParams: type === "optimization" ? optimizationParams : undefined,
    onError,
  });
  // analysisProgressRaw now returns progress fields plus cancelAnalysis when type=analysis
  const progressState: any = type === "analysis" ? analysisProgressRaw : optimizationProgress;
  const cancelAnalysisFn = type === "analysis" ? (analysisProgressRaw as any).cancelAnalysis : undefined;

  // Expose cancel function to parent if provided
  if (onCancelAvailable && cancelAnalysisFn) {
    try {
      onCancelAvailable(cancelAnalysisFn);
    } catch (e) {
      // ignore
    }
  }
  const isActive = progressState.status === "analyzing" || progressState.status === "optimizing";
  const isCompleted = progressState.status === "completed";
  const isFailed = progressState.status === "failed";

  // Use appropriate steps based on type
  const steps = type === "analysis" ? ANALYSIS_STEPS : OPTIMIZATION_STEPS;
  const currentStep = steps[progressState.currentStep];

  return (
    <div className="w-full px-2 sm:px-0">
      <Card className="w-full">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            {isActive && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary" />}
            {isCompleted && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
            {isFailed && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />}
            {!isActive && !isCompleted && !isFailed && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />}
            {type === "analysis" ? "Analyzing Your Resume" : "Optimizing Your Resume"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {type === "analysis"
              ? "Please wait while we analyze your resume against the job description"
              : "Please wait while we optimize your resume for better ATS compatibility"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <ProgressCircle
            progress={progressState.progress}
            isActive={isActive}
            isFailed={isFailed}
            isCompleted={isCompleted}
          />

          <CurrentStepCard
            step={currentStep}
            isActive={isActive}
            isCompleted={isCompleted}
            isFailed={isFailed}
          />

          <StepsList steps={steps} currentStep={progressState.currentStep} isActive={isActive} />

          <StatusMessage
            type={type}
            isFailed={isFailed}
            isCompleted={isCompleted}
            error={progressState.error}
          />
        </CardContent>
      </Card>
    </div>
  );
};
