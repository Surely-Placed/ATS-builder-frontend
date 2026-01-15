import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AnalysisApiService from "@/services/analysisApi";
import { AnalysisResult } from "@/services/analysisApi";
import { normalizeAnalysisResult } from "@/utils/analysisResultNormalizer";
import { constructFallbackResult } from "@/utils/analysis/analysisResultHelpers";

type ViewState = "form" | "analysis" | "optimizing" | "comparison" | "preview";

interface UseAnalysisHandlersProps {
  setAnalysisResult: (result: AnalysisResult) => void;
  setAnalysisId: (id: string) => void;
  setIsAnalyzing: (value: boolean) => void;
  setShowAnalysisProgress: (value: boolean) => void;
  setViewState: (state: ViewState) => void;
  setAnalysisError: (error: string | null) => void;
  resumeId: string | null;
  jobTitle: string;
  jobDescription: string;
  onComplete?: () => void;
}

export function useAnalysisHandlers({
  setAnalysisResult,
  setAnalysisId,
  setIsAnalyzing,
  setShowAnalysisProgress,
  setViewState,
  setAnalysisError,
  resumeId,
  jobTitle,
  jobDescription,
  onComplete,
}: UseAnalysisHandlersProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalysisComplete = useCallback(
    async (result: AnalysisResult | any) => {
      try {
        // Normalize the result structure first
        const normalizedResult = normalizeAnalysisResult(result);

        // Extract analysis ID
        const analysisId = normalizedResult.analysis?.id;

        if (!analysisId) {
          // If still no ID after normalization, try to fetch from API
          if (result?.id) {
            try {
              const fullAnalysisResponse = await AnalysisApiService.getAnalysis(result.id);
              const fetchedNormalized = normalizeAnalysisResult(fullAnalysisResponse);

              if (fetchedNormalized.analysis?.id) {
                const fetchedAnalysisId = fetchedNormalized.analysis.id;
                setAnalysisResult(fetchedNormalized as unknown as AnalysisResult);
                setAnalysisId(fetchedAnalysisId);
                setIsAnalyzing(false);
                setShowAnalysisProgress(false);
                // Only switch to the analysis view if we're not currently on the optimization/comparison page
                if (!window.location.pathname.includes('/resume-optimization') && !window.location.pathname.includes('/resume-comparison')) {
                  setViewState("analysis");
                }
                // Removed saveToStorage

                // Update URL with analysisId for proper routing (preserve originating route)
                // If we're already on the optimization or comparison page, avoid navigating (preserve user's current view)
                if (window.location.pathname.includes('/resume-optimization') || window.location.pathname.includes('/resume-comparison')) {
                  // Ensure query param is present without forcing a navigation
                  const url = new URL(window.location.href);
                  url.searchParams.set('analysisId', fetchedAnalysisId);
                  window.history.replaceState(window.history.state, '', url.toString());
                  // preserved optimization route, set analysisId query
                } else {
                  const targetPath = '/resume-analysis';
                  // navigating to analysis route
                  navigate(`${targetPath}?analysisId=${fetchedAnalysisId}`, { replace: true });
                }

                if (onComplete) onComplete();
                return;
              }
            } catch (error) {
              // Fallback to constructed result
            }
          }

          // If we still don't have a valid structure, use fallback
          const fallbackResult = constructFallbackResult(result, jobTitle);
          const fallbackAnalysisId = fallbackResult.analysis.id;
          setAnalysisResult(fallbackResult);
          setAnalysisId(fallbackAnalysisId);
          setIsAnalyzing(false);
          setShowAnalysisProgress(false);
          // Preserve optimization/comparison flow if user is on the optimization page
          if (!window.location.pathname.includes('/resume-optimization') && !window.location.pathname.includes('/resume-comparison')) {
            setViewState("analysis");
          }
          // Removed saveToStorage

          // Update URL with analysisId for proper routing (preserve originating route)
          if (window.location.pathname.includes('/resume-optimization') || window.location.pathname.includes('/resume-comparison')) {
            const url = new URL(window.location.href);
            url.searchParams.set('analysisId', fallbackAnalysisId);
            window.history.replaceState(window.history.state, '', url.toString());
            // preserved optimization route (fallback), set analysisId
          } else {
            // navigating to analysis route (fallback)
            navigate(`/resume-analysis?analysisId=${fallbackAnalysisId}`, { replace: true });
          }

          if (onComplete) onComplete();
          return;
        }

        // Use normalized result
        setAnalysisResult(normalizedResult as unknown as AnalysisResult);
        setAnalysisId(analysisId);
        setIsAnalyzing(false);
        setShowAnalysisProgress(false);
        // Don't force navigation away from the optimization/comparison flow; only switch to analysis view
        // when not currently on the optimization/comparison page.
        if (!window.location.pathname.includes('/resume-optimization') && !window.location.pathname.includes('/resume-comparison')) {
          setViewState("analysis");
        }
        
        // Removed setAnalysisInProgress and saveToStorage

        // Update URL with analysisId for proper routing (preserve originating route)
        if (window.location.pathname.includes('/resume-optimization') || window.location.pathname.includes('/resume-comparison')) {
          const url = new URL(window.location.href);
          url.searchParams.set('analysisId', analysisId);
          window.history.replaceState(window.history.state, '', url.toString());
          // preserved optimization route, set analysisId
        } else {
          // navigating to analysis route
          navigate(`/resume-analysis?analysisId=${analysisId}`, { replace: true });
        }

        if (onComplete) onComplete();
      } catch (error: any) {
        handleAnalysisError(
          `Analysis completed but result structure is invalid: ${error.message || "Unknown error"}`
        );
      }
    },
    [
      setAnalysisResult,
      setAnalysisId,
      setIsAnalyzing,
      setShowAnalysisProgress,
      setViewState,
      // removed
      resumeId,
      jobTitle,
      jobDescription,
      navigate,
      onComplete,
    ]
  );

  const handleAnalysisError = useCallback(
    (error: string) => {
      setAnalysisError(error);
      setIsAnalyzing(false);
      setShowAnalysisProgress(false);
      toast({
        title: "Analysis Failed",
        description: error,
        variant: "destructive",
      });
    },
    [setAnalysisError, setIsAnalyzing, setShowAnalysisProgress, toast]
  );

  const handleStartAnalysis = useCallback(() => {
    if (
      !resumeId ||
      !jobTitle.trim() ||
      !jobDescription.trim() ||
      jobDescription.trim().length < 50
    ) {
      setAnalysisError("Please provide a valid job title and description (min 50 characters)");
      return;
    }
    setAnalysisError(null);
    setIsAnalyzing(true);
    setShowAnalysisProgress(true);
    
    // Removed saveToStorage and setAnalysisInProgress
  }, [
    resumeId,
    jobTitle,
    jobDescription,
    setAnalysisError,
    setIsAnalyzing,
    setShowAnalysisProgress,
  ]);

  return {
    handleAnalysisComplete,
    handleAnalysisError,
    handleStartAnalysis,
  };
}
