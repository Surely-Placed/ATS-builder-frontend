import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnalysisResult } from '@/features/analysis/services/types';

type ViewState = "form" | "analysis" | "optimizing" | "comparison" | "preview";
import { AnalysisService } from '@/features/analysis/services/analysisService';
import { normalizeAnalysisResult } from "@/utils/analysisResultNormalizer";

export function useAnalysisState() {
  const [searchParams] = useSearchParams();


  // Check if this is a fresh start (user clicked "Analyze Another Resume")
  const isFreshStart = sessionStorage.getItem('resume_fresh_start') === 'true';

  // Clear the fresh start flag after reading it
  if (isFreshStart) {
    sessionStorage.removeItem('resume_fresh_start');
  }

  // No localStorage or storedData logic
  const urlAnalysisId = isFreshStart ? null : searchParams.get("analysisId");

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // When URL has analysisId, start on optimization view so page doesn’t load from top (form)
  const [viewState, setViewStateInternal] = useState<ViewState>(() =>
    urlAnalysisId ? "optimizing" : "form"
  );
  // Guarded setter: prevent switching back to the analysis view when the user
  // is currently on the optimization route. This avoids race-condition flips
  // where other logic navigates or restores state and hides the comparison UI.
  const setViewState = (newState: ViewState) => {
    try {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      if ((pathname.includes('/resume-optimization') || pathname.includes('/resume-comparison') || pathname.includes('/resume-preview')) && newState === 'analysis') {
        // Ignore attempts to force 'analysis' while on the optimization/comparison/preview page
        return;
      }

    } catch (e) {
      // If anything goes wrong, fall back to normal behavior
    }

    // setViewState called
    setViewStateInternal(newState);
  };
  const [analysisId, setAnalysisId] = useState<string | null>(() => urlAnalysisId);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisProgress, setShowAnalysisProgress] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Check and restore analysis state on mount (handles page refresh scenarios)
  useEffect(() => {
    const checkAnalysisStatus = async () => {
      // Skip if fresh start
      if (isFreshStart) {
        return;
      }

      // If we have analysisId but no analysisResult, try to fetch it
      // This handles page refresh during or after analysis
      const currentAnalysisId = urlAnalysisId || analysisId;

      if (currentAnalysisId && !analysisResult) {
        try {
          const response = await AnalysisService.getAnalysis(currentAnalysisId);
          const normalized = normalizeAnalysisResult(response);

          if (normalized.analysis?.id) {
            setAnalysisResult(normalized as unknown as AnalysisResult);
            setAnalysisId(normalized.analysis.id);

            // Check if optimization is complete
            const hasOptimization =
              normalized.optimized_resume ||
              (normalized.analysis?.ats_score_after !== null &&
                normalized.analysis?.ats_score_after !== undefined) ||
              normalized.ats_analysis?.after;

            if (hasOptimization) {
              setViewState("preview");
            } else {
              // No optimization yet → always show optimizing so startOptimization() is called
              // (fixes /resume-analysis?analysisId=... not hitting optimize API)
              setViewState("optimizing");
            }

            // Reset analyzing states since analysis is complete
            setIsAnalyzing(false);
            setShowAnalysisProgress(false);
            // Clear the in-progress flag
            try {
              localStorage.removeItem("resume_analysis_in_progress");
            } catch (e) {
              // Ignore
            }
          }
        } catch (error) {
          // Analysis might not exist or still in progress
          // Check if we have the in-progress flag
          const analysisInProgress = localStorage.getItem("resume_analysis_in_progress") === "true";
          if (analysisInProgress) {
            setIsAnalyzing(true);
            setShowAnalysisProgress(true);
          }
        }
      } else if (currentAnalysisId && analysisResult) {
        // We have both, but check if analysis is actually complete
        // This handles cases where state says analyzing but analysis is done
        if (isAnalyzing || showAnalysisProgress) {
          try {
            const response = await AnalysisService.getAnalysis(currentAnalysisId);
            const normalized = normalizeAnalysisResult(response);

            if (normalized.analysis?.id) {
              // Analysis exists and is complete, stop analyzing state
              setIsAnalyzing(false);
              setShowAnalysisProgress(false);

              // Update result in case it's newer
              setAnalysisResult(normalized as unknown as AnalysisResult);
            }
          } catch (error) {
            // Keep current state if fetch fails
          }
        }
      } else if (!currentAnalysisId) {
        // Check if analysis was in progress
        const analysisInProgress = localStorage.getItem("resume_analysis_in_progress") === "true";
        if (analysisInProgress) {
          // Analysis might have been just started - keep analyzing state
          setIsAnalyzing(true);
          setShowAnalysisProgress(true);
        }
      }
    };

    checkAnalysisStatus();
  }, []); // Only run on mount

  // Update analysisId when URL param changes and load analysis if needed
  useEffect(() => {
    // Check if URL has analysisId parameter
    const hasUrlAnalysisId = urlAnalysisId !== null;

    if (hasUrlAnalysisId && urlAnalysisId !== analysisId) {
      setAnalysisId(urlAnalysisId);
      // If we have analysisId in URL but no analysis result, try to load it
      if (!analysisResult && urlAnalysisId) {
        const loadAnalysisFromUrl = async () => {
          try {
            const response = await AnalysisService.getAnalysis(urlAnalysisId);
            const normalized = normalizeAnalysisResult(response);
            if (normalized.analysis?.id) {
              setAnalysisResult(normalized as unknown as AnalysisResult);

              // Check if optimization is complete - if so, set viewState to 'preview'
              // Check for optimization result in the response
              const hasOptimization =
                normalized.optimized_resume ||
                (normalized.analysis?.ats_score_after !== null &&
                  normalized.analysis?.ats_score_after !== undefined) ||
                normalized.ats_analysis?.after;

              if (hasOptimization) {
                setViewState("preview");
              } else {
                // If we have analysisId but no optimization yet, we should be in optimizing state
                // This handles the transition from analysis complete -> optimization starting
                setViewState('optimizing');
              }


            }
          } catch (error) {
            // Failed to load analysis - user will need to start new analysis
          }
        };
        loadAnalysisFromUrl();
      }
    }
  }, [urlAnalysisId, analysisId, analysisResult]);


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
