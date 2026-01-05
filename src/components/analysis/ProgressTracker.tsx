import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ANALYSIS_STEPS, OPTIMIZATION_STEPS } from '@/constants/analysis/steps';
import { useAnalysisProgress } from '@/hooks/analysis/progress/useAnalysisProgress';
import { useOptimizationProgress } from '@/hooks/analysis/progress/useOptimizationProgress';
import { ProgressCircle } from './ProgressCircle';
import { CurrentStepCard } from './CurrentStepCard';
import { StepsList } from './StepsList';
import { StatusMessage } from './StatusMessage';

interface ProgressTrackerProps {
  type: 'analysis' | 'optimization';
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
    status?: 'pending' | 'running' | 'complete' | 'failed';
    error?: string;
  };
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  type,
  onComplete,
  onError,
  analysisParams,
  optimizationParams,
}) => {
  const analysisProgress = useAnalysisProgress({
    analysisParams: type === 'analysis' ? analysisParams : undefined,
    onComplete,
    onError,
  });

  const optimizationProgress = useOptimizationProgress({
    optimizationParams: type === 'optimization' ? optimizationParams : undefined,
    onError,
  });

  const progressState = type === 'analysis' ? analysisProgress : optimizationProgress;
  const steps = type === 'analysis' ? ANALYSIS_STEPS : OPTIMIZATION_STEPS;

  const currentStep = steps[progressState.currentStep];
  const isActive = progressState.status === 'analyzing' || progressState.status === 'optimizing';
  const isCompleted = progressState.status === 'completed';
  const isFailed = progressState.status === 'failed';

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className={`w-5 h-5 ${isActive ? 'animate-spin' : ''} text-primary`} />
            {type === 'analysis' ? 'Analyzing Your Resume' : 'Optimizing Your Resume'}
          </CardTitle>
          <CardDescription>
            {type === 'analysis'
              ? 'Please wait while we analyze your resume against the job description'
              : 'Please wait while we optimize your resume for better ATS compatibility'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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

