import React from 'react';
import { Button } from '@/components/ui/button';
import { ProgressTracker } from '../ProgressTracker';
import { X } from 'lucide-react';

interface ResumeOptimizingViewProps {
  analysisId: string;
  progress: number;
  status: 'pending' | 'running' | 'complete' | 'failed';
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
  return (
    <div className="resume-analysis-flow relative w-full">
      {/* Reset Button - Top Right */}
      <Button 
        onClick={onReset}
        variant="outline"
        size="sm"
        className="absolute top-0 right-0 z-10"
      >
        <X className="w-4 h-4 mr-2" />
        Reset
      </Button>

      <div className="optimizing-view">
        <ProgressTracker
          type="optimization"
          optimizationParams={{
            analysisId,
            progress,
            status,
            error,
          }}
          onComplete={onComplete}
          onError={onError}
        />
        {error && (
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="mt-4 w-full"
          >
            ← Go Back to Analysis
          </Button>
        )}
      </div>
    </div>
  );
};


