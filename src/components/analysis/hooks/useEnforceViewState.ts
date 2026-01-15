import { useEffect } from 'react';

export function useEnforceViewState(params: any) {
  const {
    viewState,
    setViewState,
    analysisId,
    analysisResult,
    optimizationResult,
    optimizationStatus,
  } = params;

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname || '';
      if (!pathname.includes('/resume-optimization') && !pathname.includes('/resume-comparison')) return;

      const hasOptimization =
        !!optimizationResult ||
        !!(analysisResult && (
          analysisResult.optimized_resume ||
          (analysisResult.analysis && analysisResult.analysis.ats_score_after !== null && analysisResult.analysis.ats_score_after !== undefined) ||
          analysisResult.ats_analysis?.after
        )) ||
        optimizationStatus === 'complete';

      if (hasOptimization) {
        if (viewState !== 'comparison') setViewState && setViewState('comparison');
        if (analysisId) {
          const url = new URL(window.location.href);
          url.searchParams.set('analysisId', analysisId);
          window.history.replaceState(window.history.state, '', url.toString());
        }
      } else {
        if (viewState !== 'optimizing') setViewState && setViewState('optimizing');
      }
    } catch (e) {
      // noop
    }
  }, [analysisId, analysisResult, optimizationResult, optimizationStatus, viewState, setViewState]);

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
