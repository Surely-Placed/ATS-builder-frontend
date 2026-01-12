import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ViewState } from "@/hooks/useResumeAnalysisStorage";

interface UseOptimizationHandlersProps {
  analysisId: string | null;
  startOptimization: () => Promise<void>;
  setViewState: (state: ViewState) => void;
}

export function useOptimizationHandlers({
  analysisId,
  startOptimization,
  setViewState,
}: UseOptimizationHandlersProps) {
  const { toast } = useToast();

  const handleStartOptimization = useCallback(async () => {
    if (!analysisId) {
      toast({
        title: "Optimization Error",
        description: "No analysis ID available to start optimization.",
        variant: "destructive",
      });
      return;
    }

    try {
      await startOptimization();
      setViewState("optimizing");
      
      // Save state immediately when optimization starts so it persists across refresh
      try {
        localStorage.setItem("resume_analysis_view_state", "optimizing");
        if (analysisId) {
          localStorage.setItem("resume_analysis_id", analysisId);
        }
      } catch (error) {
        // Failed to save - non-critical
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to start optimization";
      toast({
        title: "Failed to start optimization",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [analysisId, startOptimization, setViewState, toast]);

  return {
    handleStartOptimization,
  };
}
