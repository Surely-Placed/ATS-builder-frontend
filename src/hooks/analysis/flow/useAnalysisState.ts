import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnalysisResult } from "@/services/analysisApi";
import { ViewState, useResumeAnalysisStorage } from "@/hooks/useResumeAnalysisStorage";
import AnalysisApiService from "@/services/analysisApi";
import { normalizeAnalysisResult } from "@/utils/analysisResultNormalizer";

export function useAnalysisState() {
  const [searchParams] = useSearchParams();
  const { loadFromStorage } = useResumeAnalysisStorage();
  
  // Check if this is a fresh start (user clicked "Analyze Another Resume")
  const isFreshStart = sessionStorage.getItem('resume_fresh_start') === 'true';
  
  // Clear the fresh start flag after reading it
  if (isFreshStart) {
    sessionStorage.removeItem('resume_fresh_start');
  }
  
  // Don't load from storage if this is a fresh start
  const storedData = isFreshStart ? null : loadFromStorage();
  const urlAnalysisId = isFreshStart ? null : searchParams.get("analysisId");

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    isFreshStart ? null : (storedData?.analysisResult || null)
  );

  // Determine initial viewState - check if optimization is complete
  const getInitialViewState = (): ViewState => {
    if (isFreshStart) {
      return "form";
    }
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
  const [analysisId, setAnalysisId] = useState<string | null>(() => {
    // If fresh start, don't restore anything
    if (isFreshStart) {
      return null;
    }
    
    // Check if the URL has an analysisId parameter
    const hasUrlAnalysisId = urlAnalysisId !== null;
    
    // Only use stored analysisId if there's also an analysisId in the URL
    // This prevents restoring old analysis when user navigates to clean URL
    if (hasUrlAnalysisId) {
      return urlAnalysisId || storedData?.analysisId || null;
    } else {
      // If no URL analysisId, don't restore from storage to allow fresh start
      return null;
    }
  });
  // Restore analyzing state from storage if analysis was in progress
  const [isAnalyzing, setIsAnalyzing] = useState(() => {
    if (isFreshStart) return false;
    // Check if analysis was in progress (has flag or has params but no result)
    const analysisInProgress = localStorage.getItem("resume_analysis_in_progress") === "true";
    const hasParamsButNoResult = storedData?.resumeId && storedData?.jobTitle && storedData?.jobDescription && !storedData?.analysisResult;
    return analysisInProgress || hasParamsButNoResult || false;
  });
  const [showAnalysisProgress, setShowAnalysisProgress] = useState(() => {
    if (isFreshStart) return false;
    const analysisInProgress = localStorage.getItem("resume_analysis_in_progress") === "true";
    const hasParamsButNoResult = storedData?.resumeId && storedData?.jobTitle && storedData?.jobDescription && !storedData?.analysisResult;
    return analysisInProgress || hasParamsButNoResult || false;
  });
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
      const currentAnalysisId = urlAnalysisId || storedData?.analysisId || analysisId;
      
      if (currentAnalysisId && !analysisResult) {
        try {
          const response = await AnalysisApiService.getAnalysis(currentAnalysisId);
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
              const stored = loadFromStorage();
              if (stored?.optimizationResult) {
                setViewState("comparison");
              } else if (
                (normalized.analysis?.ats_score_after !== null &&
                  normalized.analysis?.ats_score_after !== undefined) ||
                normalized.ats_analysis?.after
              ) {
                setViewState("comparison");
              } else {
                setViewState("analysis");
              }
            } else {
              setViewState("analysis");
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
            const response = await AnalysisApiService.getAnalysis(currentAnalysisId);
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
        const hasParamsButNoResult = storedData?.resumeId && storedData?.jobTitle && storedData?.jobDescription && !storedData?.analysisResult;
        if (analysisInProgress || hasParamsButNoResult) {
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
    } else if (!hasUrlAnalysisId && analysisId) {
      // If URL doesn't have analysisId but we have one in state, clear it
      // This happens when user navigates to a clean URL
      setAnalysisId(null);
      setAnalysisResult(null);
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
