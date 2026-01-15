import { useEffect } from 'react';

export function useFlowActions(params: any) {
  const {
    optimizationStatus,
    optimizationResult,
    analysisId,
    setViewState,
    setAnalysisResult,
    setAnalysisId,
    setJobTitle,
    setJobDescription,
    setUploadedFile,
    setResumeId,
    setOptimizationResult,
    setOptimizedResumeUrl,
    fileInputRef,
    navigate,
    toast,
    // optional cancel functions from optimization and analysis hooks
    cancelOptimization,
    cancelAnalysis,
  } = params;

  useEffect(() => {
    if (optimizationStatus === 'complete' && optimizationResult && analysisId) {
      setViewState && setViewState('comparison');
      try {
        const url = new URL(window.location.href);
        url.pathname = '/resume-comparison';
        url.searchParams.set('analysisId', analysisId);
        window.history.replaceState(window.history.state, '', url.toString());
      } catch (e) {
        navigate && navigate(`/resume-comparison?analysisId=${analysisId}`, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimizationStatus, optimizationResult, analysisId]);

  const handleStartNew = () => {
    // Mark fresh start so state restoration hooks ignore existing analysisId
    try {
      sessionStorage.setItem('resume_fresh_start', 'true');
    } catch (e) {
      // ignore
    }

    // Replace URL immediately (remove query params) to avoid race with view-state enforcement
    const target = '/resume-analysis';
    try {
      if (typeof window !== 'undefined') {
        window.history.replaceState(window.history.state, '', target);
      }
    } catch (e) {
      // ignore
    }

    try {
      navigate && navigate(target, { replace: true });
    } catch (e) {
      // ignore
    }
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('resume_') || key.startsWith('optimization_') || key.startsWith('analysis_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    setViewState && setViewState('form');
    setAnalysisResult && setAnalysisResult(null);
    setAnalysisId && setAnalysisId(null);
    setJobTitle && setJobTitle('');
    setJobDescription && setJobDescription('');
    setUploadedFile && setUploadedFile(null);
    setResumeId && setResumeId(null);
    setOptimizationResult && setOptimizationResult(null);
    setOptimizedResumeUrl && setOptimizedResumeUrl(null);

    if (fileInputRef && fileInputRef.current) {
      try { fileInputRef.current.value = ''; } catch (e) { /* noop */ }
    }

    // Cancel any in-progress optimization/polling to ensure clean state
    try {
      cancelOptimization && cancelOptimization();
      cancelAnalysis && cancelAnalysis();
    } catch (e) {
      // ignore
    }
  };

  const handlePreview = () => {
    if (!analysisId) {
      toast && toast({ title: 'Error', description: 'Analysis ID not found', variant: 'destructive' });
      return;
    }
    navigate && navigate(`/resume-preview/${analysisId}`);
  };

  return { handleStartNew, handlePreview };
}
