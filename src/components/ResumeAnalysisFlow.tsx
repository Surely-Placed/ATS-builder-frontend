import React, { useState, useEffect } from 'react';
import AnalysisApiService, { AnalysisResult, ResumeDiffResult } from '../services/analysisApi';
import { useResumeOptimization } from '../hooks/useResumeOptimization';
import { resumeApi } from '../services/resumeApi';
import ComparisonView from './ComparisonView';
import ResumePreviewWithChanges from './ResumePreviewWithChanges';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socketService';
import { useToast } from '@/hooks/use-toast';
import { getFileErrorMessage } from '@/utils/fileValidation';
import { useResumeAnalysisStorage, ViewState } from '../hooks/useResumeAnalysisStorage';
import { ResumeAnalysisFormView } from './resume/ResumeAnalysisFormView';
import { ResumeAnalysisView } from './resume/ResumeAnalysisView';
import { ResumeOptimizingView } from './resume/ResumeOptimizingView';
import './ResumeAnalysisFlow.css';

interface ResumeAnalysisFlowProps {
  onComplete?: () => void;
}

const ResumeAnalysisFlow: React.FC<ResumeAnalysisFlowProps> = ({
  onComplete,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { loadFromStorage, saveToStorage, clearStorage } = useResumeAnalysisStorage();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Connect WebSocket when component mounts and user is available
  useEffect(() => {
    if (user?.uid) {
      const connectWebSocket = async () => {
        try {
          const firebaseIdToken = await user.getIdToken();
          socketService.connect({
            userId: user.uid,
            firebaseIdToken,
          });
        } catch (error) {
          // Failed to connect WebSocket
        }
      };
      connectWebSocket();
    }
  }, [user]);

  // Initialize state from local storage or defaults
  const storedData = loadFromStorage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(storedData?.resumeId || null);
  const [jobTitle, setJobTitle] = useState(storedData?.jobTitle || '');
  const [jobDescription, setJobDescription] = useState(storedData?.jobDescription || '');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(storedData?.analysisResult || null);
  const [viewState, setViewState] = useState<ViewState>(storedData?.viewState || 'form');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAnalysisProgress, setShowAnalysisProgress] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(storedData?.analysisId || null);
  
  const {
    status: optimizationStatus,
    progress: optimizationProgress,
    result: optimizationResultHook,
    error: optimizationError,
    optimizedResumeUrl: optimizedResumeUrlHook,
    startOptimization,
    fetchAnalysis,
    downloadResume,
    isConnected: isWebSocketConnected,
  } = useResumeOptimization({
    analysisId: analysisId || '',
    onComplete: async (result) => {
      setOptimizationResult(result);
      if (result?.optimized_resume?.file_url) {
        setOptimizedResumeUrl(result.optimized_resume.file_url);
      } else if (analysisId) {
        try {
          const fetchedAnalysis = await fetchAnalysis();
          setOptimizedResumeUrl(fetchedAnalysis?.resume?.optimized_file_url || fetchedAnalysis?.analysis?.optimized_resume_url || null);
        } catch (err) {
          // Failed to fetch analysis after optimization
        }
      }
    },
  });

  const [optimizationResult, setOptimizationResult] = useState(storedData?.optimizationResult || null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState(storedData?.optimizedResumeUrl || null);
  const [previewData, setPreviewData] = useState<{
    originalResume: any;
    optimizedResume: any;
    changes: ResumeDiffResult;
  } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Update local state when hook result changes
  useEffect(() => {
    if (optimizationResultHook) {
      setOptimizationResult(optimizationResultHook);
    }
    if (optimizedResumeUrlHook) {
      setOptimizedResumeUrl(optimizedResumeUrlHook);
    }
  }, [optimizationResultHook, optimizedResumeUrlHook]);

  const handleFileSelect = async (file: File) => {
    const errorMsg = getFileErrorMessage(file);
    if (errorMsg) {
      toast({
        title: 'Invalid file',
        description: errorMsg,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadedResumeId = await resumeApi.uploadResume(file);
      setResumeId(uploadedResumeId);
      setUploadedFile(file);
      toast({
        title: 'File uploaded',
        description: `${file.name} uploaded successfully`,
      });
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err.message || 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setResumeId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = () => {
    if (!resumeId || !jobTitle.trim() || !jobDescription.trim() || jobDescription.trim().length < 50) {
      setAnalysisError('Please provide a valid job title and description (min 50 characters)');
      return;
    }
    setAnalysisError(null);
    setIsAnalyzing(true);
    setShowAnalysisProgress(true);
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setAnalysisId(result.analysis.id);
    setIsAnalyzing(false);
    setShowAnalysisProgress(false);
    setViewState('analysis');
    saveToStorage(result, 'analysis', result.analysis.id, resumeId, jobTitle, jobDescription);
    if (onComplete) onComplete();
  };

  const handleAnalysisError = (error: string) => {
    setAnalysisError(error);
    setIsAnalyzing(false);
    setShowAnalysisProgress(false);
    toast({
      title: 'Analysis Failed',
      description: error,
      variant: 'destructive',
    });
  };

  const handleStartOptimization = async () => {
    if (!analysisId) {
      toast({
        title: 'Optimization Error',
        description: 'No analysis ID available to start optimization.',
        variant: 'destructive',
      });
      return;
    }
    if (!isWebSocketConnected) {
      toast({
        title: 'Connection Error',
        description: 'WebSocket is not connected. Please check your internet connection or try again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await startOptimization();
      setViewState('optimizing');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to start optimization';
      toast({
        title: 'Failed to start optimization',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Auto-navigate to comparison when optimization completes
  useEffect(() => {
    if (optimizationStatus === 'complete' && optimizationResult) {
      setViewState('comparison');
      saveToStorage(
        analysisResult,
        'comparison',
        analysisId,
        resumeId,
        jobTitle,
        jobDescription,
        optimizationResult,
        optimizedResumeUrl
      );
    }
  }, [optimizationStatus, optimizationResult, optimizedResumeUrl, analysisResult, analysisId, resumeId, jobTitle, jobDescription, saveToStorage]);

  const handleDownload = () => {
    try {
      downloadResume();
      toast({
        title: 'Download started',
        description: 'Your optimized resume is downloading',
      });
    } catch (err: any) {
      toast({
        title: 'Download failed',
        description: err.message || 'Failed to download resume',
        variant: 'destructive',
      });
    }
  };

  const handleStartNew = () => {
    setViewState('form');
    setAnalysisResult(null);
    setAnalysisId(null);
    setJobTitle('');
    setJobDescription('');
    setUploadedFile(null);
    setResumeId(null);
    setPreviewData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    clearStorage();
  };

  const handlePreview = async () => {
    if (!analysisId) {
      toast({
        title: 'Error',
        description: 'Analysis ID not found',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingPreview(true);
    try {
      const previewResponse = await AnalysisApiService.getPreview(analysisId);
      setPreviewData({
        originalResume: previewResponse.original_resume.structured_data,
        optimizedResume: previewResponse.optimized_resume.structured_data,
        changes: previewResponse.changes,
      });
      setViewState('preview');
    } catch (err: any) {
      toast({
        title: 'Failed to load preview',
        description: err.message || 'Could not load resume preview',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handlePreviewConfirm = async () => {
    if (!analysisId) return;

    setIsGeneratingPDF(true);
    try {
      const pdfResponse = await AnalysisApiService.generatePDF(analysisId);
      if (pdfResponse.file_url) {
        setOptimizedResumeUrl(pdfResponse.file_url);
        AnalysisApiService.downloadResume(pdfResponse.file_url, 'optimized-resume.pdf', resumeId || undefined);
        toast({
          title: 'PDF Generated & Downloaded',
          description: 'Your optimized resume PDF has been generated and downloaded successfully',
        });
      }
      setViewState('comparison');
    } catch (err: any) {
      toast({
        title: 'Failed to generate PDF',
        description: err.message || 'Could not generate PDF',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePreviewCancel = () => {
    setViewState('comparison');
  };

  // Save to storage whenever relevant state changes
  useEffect(() => {
    if (analysisResult && viewState !== 'form') {
      saveToStorage(
        analysisResult, 
        viewState, 
        analysisId, 
        resumeId, 
        jobTitle, 
        jobDescription,
        optimizationResult,
        optimizedResumeUrl
      );
    }
  }, [analysisResult, viewState, analysisId, resumeId, jobTitle, jobDescription, optimizationResult, optimizedResumeUrl, saveToStorage]);

  // Render Analysis View
  if (viewState === 'analysis' && analysisResult) {
    return (
      <ResumeAnalysisView
        analysisResult={analysisResult}
        isWebSocketConnected={isWebSocketConnected}
        onStartOptimization={handleStartOptimization}
        onStartNew={handleStartNew}
      />
    );
  }

  // Render Optimizing View
  if (viewState === 'optimizing' && analysisId) {
    const optimizationStatusMapped = 
      optimizationStatus === 'starting' ? 'pending' : 
      optimizationStatus === 'running' ? 'running' : 
      optimizationStatus === 'complete' ? 'complete' : 'failed';

    return (
      <ResumeOptimizingView
        analysisId={analysisId}
        progress={optimizationProgress}
        status={optimizationStatusMapped}
        error={optimizationError || undefined}
        onReset={() => setViewState('analysis')}
        onComplete={() => setViewState('comparison')}
        onError={(error) => {
          toast({
            title: 'Optimization Failed',
            description: error,
            variant: 'destructive',
          });
        }}
      />
    );
  }

  // Render Preview View
  if (viewState === 'preview' && previewData) {
    return (
      <ResumePreviewWithChanges
        originalResume={previewData.originalResume}
        optimizedResume={previewData.optimizedResume}
        changes={previewData.changes}
        onConfirm={handlePreviewConfirm}
        onCancel={handlePreviewCancel}
        isGenerating={isGeneratingPDF}
      />
    );
  }

  // Render Comparison View
  if (viewState === 'comparison' && analysisResult && optimizationResult) {
    return (
      <ComparisonView
        originalAnalysis={analysisResult}
        optimizedResult={optimizationResult}
        onDownload={handleDownload}
        onStartNew={handleStartNew}
        onPreview={handlePreview}
        isPreviewLoading={isLoadingPreview}
      />
    );
  }

  // Render Form View (Default)
  return (
    <div className="resume-analysis-flow">
      <ResumeAnalysisFormView
        uploadedFile={uploadedFile}
        jobTitle={jobTitle}
        jobDescription={jobDescription}
        resumeId={resumeId}
        isUploading={isUploading}
        isAnalyzing={isAnalyzing}
        analysisError={analysisError}
        showAnalysisProgress={showAnalysisProgress}
        fileInputRef={fileInputRef}
        onFileSelect={handleFileSelect}
        onJobTitleChange={setJobTitle}
        onJobDescriptionChange={setJobDescription}
        onRemoveFile={handleRemoveFile}
        onStartAnalysis={handleStartAnalysis}
        onReset={handleStartNew}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
      />
    </div>
  );
};

export default ResumeAnalysisFlow;
