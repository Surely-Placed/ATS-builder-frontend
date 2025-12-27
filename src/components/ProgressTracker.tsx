import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, X } from 'lucide-react';
import AnalysisApiService from '../services/analysisApi';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedTime: number; // in milliseconds
}

interface ProgressState {
  currentStep: number;
  progress: number;
  status: 'idle' | 'analyzing' | 'optimizing' | 'completed' | 'failed';
  error?: string;
  jobId?: string;
}

// Analysis Steps (synchronous - simulated progress)
const ANALYSIS_STEPS: Step[] = [
  {
    id: 'retrieve-resume',
    title: 'Retrieving Resume',
    description: 'Loading resume from database',
    icon: '📄',
    estimatedTime: 500,
  },
  {
    id: 'parse-resume',
    title: 'Parsing Resume',
    description: 'Extracting content and structure',
    icon: '📝',
    estimatedTime: 2000,
  },
  {
    id: 'extract-job',
    title: 'Analyzing Job Description',
    description: 'Extracting requirements and skills',
    icon: '🔍',
    estimatedTime: 3000,
  },
  {
    id: 'save-job',
    title: 'Saving Job Details',
    description: 'Storing job information',
    icon: '💾',
    estimatedTime: 800,
  },
  {
    id: 'calculate-score',
    title: 'Calculating ATS Score',
    description: 'Computing compatibility score',
    icon: '📊',
    estimatedTime: 1500,
  },
  {
    id: 'ai-analysis',
    title: 'AI Analysis',
    description: 'Analyzing with AI recommendations',
    icon: '🤖',
    estimatedTime: 4000,
  },
  {
    id: 'save-analysis',
    title: 'Finalizing Results',
    description: 'Saving analysis to database',
    icon: '✨',
    estimatedTime: 700,
  },
];

// Optimization Steps (async - real-time via WebSocket)
const OPTIMIZATION_STEPS: Step[] = [
  {
    id: 'starting',
    title: 'Starting Optimization',
    description: 'Initializing optimization process',
    icon: '🚀',
    estimatedTime: 1000,
  },
  {
    id: 'parse-resume',
    title: 'Parsing Resume',
    description: 'Extracting resume structure',
    icon: '📝',
    estimatedTime: 2000,
  },
  {
    id: 'extract-job',
    title: 'Extracting Job Info',
    description: 'Analyzing job requirements',
    icon: '🔍',
    estimatedTime: 2000,
  },
  {
    id: 'calculate-baseline',
    title: 'Calculating Baseline Score',
    description: 'Computing initial ATS score',
    icon: '📊',
    estimatedTime: 1500,
  },
  {
    id: 'ai-ats-analysis',
    title: 'AI ATS Analysis',
    description: 'Deep analysis with AI',
    icon: '🤖',
    estimatedTime: 3000,
  },
  {
    id: 'optimize-resume',
    title: 'Optimizing Resume',
    description: 'AI-powered optimization',
    icon: '✨',
    estimatedTime: 5000,
  },
  {
    id: 'verify-audit',
    title: 'Verifying & Auditing',
    description: 'Keyword alignment and quality check',
    icon: '🔍',
    estimatedTime: 4000,
  },
  {
    id: 'generate-pdf',
    title: 'Generating PDF',
    description: 'Creating ATS-friendly PDF',
    icon: '📄',
    estimatedTime: 3000,
  },
  {
    id: 'upload-file',
    title: 'Uploading File',
    description: 'Saving optimized resume',
    icon: '☁️',
    estimatedTime: 2000,
  },
  {
    id: 'finalizing',
    title: 'Finalizing',
    description: 'Updating records',
    icon: '💾',
    estimatedTime: 1500,
  },
];

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
  const [progressState, setProgressState] = useState<ProgressState>({
    currentStep: 0,
    progress: 0,
    status: 'idle',
  });

  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const steps = type === 'analysis' ? ANALYSIS_STEPS : OPTIMIZATION_STEPS;
  const totalEstimatedTime = steps.reduce((sum, step) => sum + step.estimatedTime, 0);

  // Simulate analysis progress based on estimated times
  const simulateAnalysisProgress = useCallback(async () => {
    if (!analysisParams) return;

    setProgressState({ currentStep: 0, progress: 0, status: 'analyzing' });
    startTimeRef.current = Date.now();

    const startAnalysis = async () => {
      try {
        // Start API call
        const apiCallPromise = AnalysisApiService.analyzeResume({
          resume_id: analysisParams.resumeId,
          job_description: analysisParams.jobDescription,
          job_title: analysisParams.jobTitle,
        });

        // Simulate progress while API call is in progress
        analysisIntervalRef.current = setInterval(() => {
          const elapsedTime = Date.now() - startTimeRef.current;
          const progressRatio = Math.min(elapsedTime / totalEstimatedTime, 0.92); // Cap at 92% until API completes

          // Determine current step based on cumulative time
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

          // Calculate progress within current step
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
            status: 'analyzing',
          });
        }, 100); // Update every 100ms

        // Wait for API to complete
        const result = await apiCallPromise;

        if (analysisIntervalRef.current) {
          clearInterval(analysisIntervalRef.current);
          analysisIntervalRef.current = null;
        }

        // Complete progress
        setProgressState({
          currentStep: steps.length - 1,
          progress: 100,
          status: 'completed',
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
          status: 'failed',
          error: error.message || 'Analysis failed',
        });
        if (onError) {
          onError(error.message || 'Analysis failed');
        }
      }
    };

    startAnalysis();
  }, [analysisParams, steps, totalEstimatedTime, onComplete, onError]);

  // Handle optimization progress from parent component (via props)
  useEffect(() => {
    if (type === 'optimization' && optimizationParams) {
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

      if (status === 'failed') {
        setProgressState({
          currentStep: stepIndex,
          progress,
          status: 'failed',
          error: error || 'Optimization failed',
        });
        if (onError) {
          onError(error || 'Optimization failed');
        }
      } else if (status === 'complete') {
        setProgressState({
          currentStep: steps.length - 1,
          progress: 100,
          status: 'completed',
        });
      } else {
        setProgressState({
          currentStep: stepIndex,
          progress,
          status: 'optimizing',
        });
      }
    }
  }, [type, optimizationParams, steps, onError]);

  // Start analysis when component mounts
  useEffect(() => {
    if (type === 'analysis' && analysisParams) {
      simulateAnalysisProgress();
    }
  }, [type, analysisParams, simulateAnalysisProgress]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

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
          {/* Progress Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <Loader2
                className={`w-32 h-32 ${isActive ? 'animate-spin' : ''} ${
                  isFailed ? 'text-destructive' : isCompleted ? 'text-green-500' : 'text-primary'
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {Math.round(progressState.progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Current Step Card */}
          {currentStep && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentStep.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{currentStep.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                </div>
                {isActive && (
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                )}
                {isCompleted && (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                )}
                {isFailed && (
                  <X className="w-6 h-6 text-destructive" />
                )}
              </div>
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isPast = index < progressState.currentStep;
              const isCurrent = index === progressState.currentStep;
              const isFuture = index > progressState.currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                    isCurrent
                      ? 'bg-primary/10 border-2 border-primary shadow-md'
                      : isPast
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-muted/50 border border-border opacity-60'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isCurrent ? (
                      <span className="text-2xl">{step.icon}</span>
                    ) : (
                      <span className="text-muted-foreground text-xl">{step.icon}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        isCurrent ? 'text-primary' : isPast ? 'text-green-600' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        isCurrent ? 'text-primary/80' : isPast ? 'text-green-600/80' : 'text-muted-foreground'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && isActive && (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {isFailed && progressState.error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-medium">Error: {progressState.error}</p>
            </div>
          )}

          {/* Success Message */}
          {isCompleted && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
              <p className="text-green-600 font-medium">
                {type === 'analysis'
                  ? 'Analysis completed successfully!'
                  : 'Optimization completed successfully!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

