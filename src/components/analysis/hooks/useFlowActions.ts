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

    navigate && navigate('/resume-analysis', { replace: true });
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
