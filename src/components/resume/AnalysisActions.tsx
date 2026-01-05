import { Button } from '@/components/ui/button';
import { AlertCircle, Target, Loader2 } from 'lucide-react';

interface AnalysisActionsProps {
  canStartAnalysis: boolean;
  isAnalyzing: boolean;
  isUploading: boolean;
  analysisError: string | null;
  hasData: boolean;
  onStartAnalysis: () => void;
  onReset: () => void;
}

export const AnalysisActions = ({
  canStartAnalysis,
  isAnalyzing,
  isUploading,
  analysisError,
  hasData,
  onStartAnalysis,
  onReset,
}: AnalysisActionsProps) => {
  return (
    <>
      {analysisError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">{analysisError}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={onStartAnalysis}
          disabled={!canStartAnalysis || isAnalyzing || isUploading}
          className="flex-1"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Start Analysis
            </>
          )}
        </Button>
        {hasData && (
          <Button onClick={onReset} variant="outline" disabled={isAnalyzing || isUploading}>
            Reset
          </Button>
        )}
      </div>
    </>
  );
};

