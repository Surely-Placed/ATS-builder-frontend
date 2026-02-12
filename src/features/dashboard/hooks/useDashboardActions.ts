import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { OptimizationService } from "@/features/analysis/services/optimizationService";
import { useToast } from "@/hooks/use-toast";

export type AnalysisStatus =
  | "optimization_pending"
  | "optimization_processing"
  | "optimization_completed"
  | "optimization_failed"
  | "initial_processed"
  | "initial_failed";

export type DashboardRow = {
  analysisId: string | null;
  status: string | null;
};

/**
 * Single "Continue / Optimize" action for dashboard rows.
 * - Pending/processing/completed → go to resume-analysis page.
 * - initial_processed → start optimization via API, then go to resume-analysis.
 * - Failed/unknown → go to resume-analysis page.
 */
export function useDashboardActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinueOrOptimize = useCallback(
    async (row: DashboardRow) => {
      if (!row.analysisId) return;

      const status = (row.status ?? "").toLowerCase();

      // Already in optimization flow or done → go to analysis page
      if (
        status === "optimization_pending" ||
        status === "optimization_processing" ||
        status === "optimization_completed"
      ) {
        navigate(`/resume-analysis?analysisId=${row.analysisId}`);
        return;
      }

      // Initial analysis done but not optimized → start optimization, then go
      if (status === "initial_processed") {
        try {
          await OptimizationService.startOptimization(row.analysisId);
          toast({
            title: "Optimization started",
            description: "Taking you to the optimization page.",
          });
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Failed to start optimization";
          toast({
            variant: "destructive",
            title: "Could not start optimization",
            description: message,
          });
        }
        navigate(`/resume-analysis?analysisId=${row.analysisId}`);
        return;
      }

      // Failed or unknown → go to analysis page (user can retry there)
      navigate(`/resume-analysis?analysisId=${row.analysisId}`);
    },
    [navigate, toast]
  );

  return { handleContinueOrOptimize };
}
