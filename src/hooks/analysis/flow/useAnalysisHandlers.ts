import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AnalysisApiService from "@/services/analysisApi";
import { AnalysisResult } from "@/services/analysisApi";
import { normalizeAnalysisResult } from "@/utils/analysisResultNormalizer";
import { constructFallbackResult } from "@/utils/analysis/analysisResultHelpers";
import { ViewState } from "@/hooks/useResumeAnalysisStorage";

interface UseAnalysisHandlersProps {
  setAnalysisResult: (result: AnalysisResult) => void;
  setAnalysisId: (id: string) => void;
  setIsAnalyzing: (value: boolean) => void;
  setShowAnalysisProgress: (value: boolean) => void;
  setViewState: (state: ViewState) => void;
  setAnalysisError: (error: string | null) => void;
  saveToStorage: (
    result: AnalysisResult,
    viewState: ViewState,
    analysisId: string,
    resumeId: string | null,
    jobTitle: string,
    jobDescription: string
  ) => void;
  setAnalysisInProgress: (inProgress: boolean) => void;
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
  saveToStorage,
  setAnalysisInProgress,
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
                setViewState("analysis");
                saveToStorage(
                  fetchedNormalized as unknown as AnalysisResult,
                  "analysis",
                  fetchedAnalysisId,
                  resumeId,
                  jobTitle,
                  jobDescription
                );

                // Update URL with analysisId for proper routing
                navigate(`/resume-optimization?analysisId=${fetchedAnalysisId}`, { replace: true });

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
          setViewState("analysis");
          saveToStorage(
            fallbackResult,
            "analysis",
            fallbackAnalysisId,
            resumeId,
            jobTitle,
            jobDescription
          );

          // Update URL with analysisId for proper routing
          navigate(`/resume-optimization?analysisId=${fallbackAnalysisId}`, { replace: true });

          if (onComplete) onComplete();
          return;
        }

        // Use normalized result
        setAnalysisResult(normalizedResult as unknown as AnalysisResult);
        setAnalysisId(analysisId);
        setIsAnalyzing(false);
        setShowAnalysisProgress(false);
        setViewState("analysis");
        
        // Clear the in-progress flag since analysis is complete
        try {
          setAnalysisInProgress(false);
        } catch (e) {
          // Ignore
        }
        
        saveToStorage(
          normalizedResult as unknown as AnalysisResult,
          "analysis",
          analysisId,
          resumeId,
          jobTitle,
          jobDescription
        );

        // Update URL with analysisId for proper routing
        navigate(`/resume-optimization?analysisId=${analysisId}`, { replace: true });

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
      saveToStorage,
      setAnalysisInProgress,
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
    
    // Save state immediately when analysis starts so it persists across refresh
    try {
      // Save form data even without analysis result yet
      saveToStorage(
        null, // analysisResult
        "form", // viewState - we're starting analysis
        null, // analysisId
        resumeId,
        jobTitle,
        jobDescription
      );
      // Save a flag to indicate analysis is in progress
      setShowAnalysisProgress(true);
    } catch (error) {
      // Failed to save - non-critical
    }
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
