import { useEffect } from 'react';

export function useEnforceViewState(params: any) {
  const {
    viewState,
    setViewState,
    analysisId,
    analysisResult,
    optimizationResult,
    optimizationStatus,
    navigate, // Added navigate to params destructuring
  } = params;

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname || '';

      const hasOptimization =
        !!optimizationResult ||
        !!(analysisResult && (
          analysisResult.optimized_resume ||
          (analysisResult.analysis && analysisResult.analysis.ats_score_after !== null && analysisResult.analysis.ats_score_after !== undefined) ||
          analysisResult.ats_analysis?.after
        )) ||
        optimizationStatus === 'complete';

      if (hasOptimization) {
        // Navigate to comparison screen instead of preview
        if (analysisId && !pathname.includes('/resume-comparison')) {
          navigate && navigate(`/resume-comparison?analysisId=${analysisId}`, { replace: true });
        }
      } else {
        // Only force optimizing view if we actually have an analysisId
        if (analysisId && viewState !== 'optimizing') setViewState && setViewState('optimizing');
      }
    } catch (e) {
      // noop
    }
  }, [analysisId, analysisResult, optimizationResult, optimizationStatus, viewState, setViewState, navigate]); // Added navigate to dependencies


  useEffect(() => {
    try {
      if (viewState === 'analysis') {
        const url = new URL(window.location.href);
        if (analysisId) {
          url.pathname = '/resume-optimization';
          url.searchParams.set('analysisId', analysisId);
        } else {
          url.pathname = '/resume-analysis';
          url.searchParams.delete('analysisId');
        }
        window.history.replaceState(window.history.state, '', url.toString());
      }
    } catch (e) {
      // noop
    }
  }, [viewState, analysisId, setViewState]);
}
