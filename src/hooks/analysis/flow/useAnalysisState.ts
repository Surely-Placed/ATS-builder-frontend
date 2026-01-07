import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnalysisResult } from "@/services/analysisApi";
import { ViewState, useResumeAnalysisStorage } from "@/hooks/useResumeAnalysisStorage";
import AnalysisApiService from "@/services/analysisApi";
import { normalizeAnalysisResult } from "@/utils/analysisResultNormalizer";

export function useAnalysisState() {
  const [searchParams] = useSearchParams();
  const { loadFromStorage } = useResumeAnalysisStorage();
  const storedData = loadFromStorage();
  const urlAnalysisId = searchParams.get("analysisId");

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    storedData?.analysisResult || null
  );

  // Determine initial viewState - check if optimization is complete
  const getInitialViewState = (): ViewState => {
    if (storedData?.viewState) {
      // If we have a stored viewState, use it
      return storedData.viewState;
    }
    // Check if optimization result exists in storage
    if (storedData?.optimizationResult) {
      return "comparison";
    }
    // Check if analysis result exists
    if (storedData?.analysisResult) {
      return "analysis";
    }
    return "form";
  };

  const [viewState, setViewState] = useState<ViewState>(getInitialViewState());
  const [analysisId, setAnalysisId] = useState<string | null>(
    urlAnalysisId || storedData?.analysisId || null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisProgress, setShowAnalysisProgress] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Update analysisId when URL param changes and load analysis if needed
  useEffect(() => {
    if (urlAnalysisId && urlAnalysisId !== analysisId) {
      setAnalysisId(urlAnalysisId);
      // If we have analysisId in URL but no analysis result, try to load it
      if (!analysisResult && urlAnalysisId) {
        const loadAnalysisFromUrl = async () => {
          try {
            const response = await AnalysisApiService.getAnalysis(urlAnalysisId);
            const normalized = normalizeAnalysisResult(response);
            if (normalized.analysis?.id) {
              setAnalysisResult(normalized as unknown as AnalysisResult);

              // Check if optimization is complete - if so, set viewState to 'comparison'
              // Check for optimization result in the response
              const hasOptimization =
                normalized.optimized_resume ||
                (normalized.analysis?.ats_score_after !== null &&
                  normalized.analysis?.ats_score_after !== undefined) ||
                normalized.ats_analysis?.after;

              if (hasOptimization) {
                // Try to load optimization result from storage first
                const stored = loadFromStorage();
                if (stored?.optimizationResult) {
                  setViewState("comparison");
                } else {
                  // Check if we can determine optimization status from the analysis
                  // If ats_score_after exists, optimization is likely complete
                  if (
                    (normalized.analysis?.ats_score_after !== null &&
                      normalized.analysis?.ats_score_after !== undefined) ||
                    normalized.ats_analysis?.after
                  ) {
                    setViewState("comparison");
                  } else {
                    setViewState("analysis");
                  }
                }
              } else {
                setViewState("analysis");
              }
            }
          } catch (error) {
            // Failed to load analysis - user will need to start new analysis
          }
        };
        loadAnalysisFromUrl();
      }
    }
  }, [urlAnalysisId, analysisId, analysisResult, loadFromStorage]);

  return {
    analysisResult,
    setAnalysisResult,
    viewState,
    setViewState,
    analysisId,
    setAnalysisId,
    isAnalyzing,
    setIsAnalyzing,
    showAnalysisProgress,
    setShowAnalysisProgress,
    analysisError,
    setAnalysisError,
  };
}
