import { Button } from "@/components/ui/button";
import { AlertCircle, Target, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUsage } from '@/context/UsageContext';
import PricingDialog from '@/components/shared/PricingDialog';

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
  const { state } = useUsage();
  const remainingRaw = state.remaining;
  const remaining = remainingRaw === 'unlimited' ? Infinity : (typeof remainingRaw === 'number' ? remainingRaw : null);
  const trialBlocked = remaining !== null && remaining <= 0;
  const [showPricing, setShowPricing] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!isAnalyzing) {
      setClicked(false);
    }
  }, [isAnalyzing]);

  const handleStart = () => {
    if (trialBlocked) {
      setClicked(true);
      setShowPricing(true);
      setTimeout(() => setClicked(false), 600);
      return;
    }
    setClicked(true);
    onStartAnalysis();
  };
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
          onClick={handleStart}
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
              {(clicked) && (
                <span className="ml-2 inline-flex items-center" aria-hidden>
                  <span className="w-4 h-4 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
                </span>
              )}
            </>
          )}
        </Button>
        {hasData && (
          <Button onClick={onReset} variant="outline" disabled={isAnalyzing || isUploading}>
            Reset
          </Button>
        )}
        <PricingDialog open={showPricing} onClose={() => setShowPricing(false)} hideFreeTrial={trialBlocked} />
      </div>
    </>
  );
};
