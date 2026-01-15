import { useEffect } from 'react';

export function useRestoreOptimizationState(params: any) {
  const {
    viewState,
    analysisResult,
    resumeId,
    jobTitle,
    jobDescription,
    analysisId,
    setAnalysisResult,
    setIsAnalyzing,
    setShowAnalysisProgress,
    setViewState,
    fetchAnalysis,
    analysisInProgress,
  } = params;

  useEffect(() => {
    const restoreOptimizationState = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasUrlAnalysisId = urlParams.get('analysisId') !== null;

        if (!hasUrlAnalysisId && viewState === 'form') return;

        if (!analysisResult && resumeId && jobTitle && jobDescription && analysisId) {
          try {
            const fetchedAnalysis = await fetchAnalysis();
            if (fetchedAnalysis?.analysis?.id) {
              setAnalysisResult && setAnalysisResult(fetchedAnalysis);
              setIsAnalyzing && setIsAnalyzing(false);
              setShowAnalysisProgress && setShowAnalysisProgress(false);

              const hasOptimization =
                fetchedAnalysis?.optimized_resume ||
                (fetchedAnalysis?.analysis?.ats_score_after !== null && fetchedAnalysis?.analysis?.ats_score_after !== undefined) ||
                fetchedAnalysis?.ats_analysis?.after;

              if (hasOptimization) {
                setViewState && setViewState('comparison');
              } else {
                setViewState && setViewState('analysis');
              }
            }
          } catch (err) {
            const inProgress = (analysisInProgress && analysisInProgress()) || false;
            if (inProgress) {
              setIsAnalyzing && setIsAnalyzing(true);
              setShowAnalysisProgress && setShowAnalysisProgress(true);
            }
          }
        }

        if (analysisId && analysisResult) {
          const hasOptimization =
            analysisResult.optimized_resume ||
            (analysisResult.analysis?.ats_score_after !== null && analysisResult.analysis?.ats_score_after !== undefined) ||
            analysisResult.ats_analysis?.after;

          if (hasOptimization && viewState === 'analysis') {
            try {
              const fetchedAnalysis = await fetchAnalysis();
              if (fetchedAnalysis?.optimized_resume || fetchedAnalysis?.analysis?.ats_score_after) {
                setViewState && setViewState('comparison');
              }
            } catch (e) {
              // noop
            }
          }

          if (viewState === 'optimizing' && analysisId) {
            try {
              const fetchedAnalysis = await fetchAnalysis();
              const isComplete =
                fetchedAnalysis?.optimized_resume ||
                (fetchedAnalysis?.analysis?.ats_score_after !== null && fetchedAnalysis?.analysis?.ats_score_after !== undefined) ||
                fetchedAnalysis?.ats_analysis?.after;

              if (isComplete) {
                setViewState && setViewState('comparison');
              }
            } catch (e) {
              // noop
            }
          }
        } else if (viewState === 'optimizing' && analysisId) {
          // let polling handle it
        }

        if (viewState === 'form' && resumeId && jobTitle && jobDescription && !analysisResult) {
          if (analysisId) {
            try {
              const fetchedAnalysis = await fetchAnalysis();
              if (fetchedAnalysis?.analysis?.id) {
                setAnalysisResult && setAnalysisResult(fetchedAnalysis);
                setIsAnalyzing && setIsAnalyzing(false);
                setShowAnalysisProgress && setShowAnalysisProgress(false);

                const hasOptimization =
                  fetchedAnalysis?.optimized_resume ||
                  (fetchedAnalysis?.analysis?.ats_score_after !== null && fetchedAnalysis?.analysis?.ats_score_after !== undefined) ||
                  fetchedAnalysis?.ats_analysis?.after;

                setViewState && setViewState(hasOptimization ? 'comparison' : 'analysis');
              }
            } catch (err) {
              const isAnalysisInProgress = (analysisInProgress && analysisInProgress()) || false;
              if (isAnalysisInProgress) {
                setIsAnalyzing && setIsAnalyzing(true);
                setShowAnalysisProgress && setShowAnalysisProgress(true);
              }
            }
          } else {
            const isAnalysisInProgress = (analysisInProgress && analysisInProgress()) || false;
            if (isAnalysisInProgress) {
              setIsAnalyzing && setIsAnalyzing(true);
              setShowAnalysisProgress && setShowAnalysisProgress(true);
            }
          }
        }
      } catch (e) {
        // best-effort
      }
    };

    restoreOptimizationState();
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
