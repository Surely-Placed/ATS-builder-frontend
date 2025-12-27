import React, { useState, useEffect } from 'react';
import AnalysisApiService, { AnalysisResult, ResumeDiffResult } from '../services/analysisApi';
import { useResumeOptimization } from '../hooks/useResumeOptimization';
import { resumeApi } from '../services/resumeApi';
import ComparisonView from './ComparisonView';
import ResumePreviewWithChanges from './ResumePreviewWithChanges';
import { ProgressTracker } from './ProgressTracker';
import { ResumeQualityFeedback } from './ResumeQualityFeedback';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socketService';
import { getDisplayScores } from '../utils/scoreUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  AlertCircle,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Target,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getFileErrorMessage } from '@/utils/fileValidation';
import './ResumeAnalysisFlow.css';

interface ResumeAnalysisFlowProps {
  onComplete?: () => void;
}

type ViewState = 'form' | 'analysis' | 'optimizing' | 'comparison' | 'preview';

const ResumeAnalysisFlow: React.FC<ResumeAnalysisFlowProps> = ({
  onComplete,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Connect WebSocket when component mounts and user is available
  // Note: The useResumeOptimization hook also handles connection, but we connect here
  // to ensure WebSocket is ready for optimization jobs
  useEffect(() => {
    if (user?.uid) {
      const connectWebSocket = async () => {
        try {
          // Get Firebase ID token
          const firebaseIdToken = await user.getIdToken();
          
          // Connect with Firebase ID token
          socketService.connect({
            userId: user.uid, // Optional: for logging
            firebaseIdToken: firebaseIdToken, // This will work now!
          });
        } catch (error) {
          // Failed to connect WebSocket
        }
      };

      connectWebSocket();
    }
    return () => {
      // Optionally disconnect on unmount (or keep connected for other components)
      // socketService.disconnect();
    };
  }, [user]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Local storage keys
  const STORAGE_KEYS = {
    ANALYSIS_RESULT: 'resume_analysis_result',
    VIEW_STATE: 'resume_analysis_view_state',
    ANALYSIS_ID: 'resume_analysis_id',
    RESUME_ID: 'resume_analysis_resume_id',
    JOB_TITLE: 'resume_analysis_job_title',
    JOB_DESCRIPTION: 'resume_analysis_job_description',
    OPTIMIZATION_RESULT: 'resume_optimization_result',
    OPTIMIZED_RESUME_URL: 'resume_optimized_url',
  };

  // Load from local storage on mount
  const loadFromStorage = () => {
    try {
      const storedResult = localStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULT);
      const storedViewState = localStorage.getItem(STORAGE_KEYS.VIEW_STATE) as ViewState | null;
      const storedAnalysisId = localStorage.getItem(STORAGE_KEYS.ANALYSIS_ID);
      const storedResumeId = localStorage.getItem(STORAGE_KEYS.RESUME_ID);
      const storedJobTitle = localStorage.getItem(STORAGE_KEYS.JOB_TITLE);
      const storedJobDescription = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTION);
      const storedOptimizationResult = localStorage.getItem(STORAGE_KEYS.OPTIMIZATION_RESULT);
      const storedOptimizedUrl = localStorage.getItem(STORAGE_KEYS.OPTIMIZED_RESUME_URL);

      if (storedResult && storedViewState) {
        return {
          analysisResult: JSON.parse(storedResult) as AnalysisResult,
          viewState: storedViewState,
          analysisId: storedAnalysisId,
          resumeId: storedResumeId,
          jobTitle: storedJobTitle || '',
          jobDescription: storedJobDescription || '',
          optimizationResult: storedOptimizationResult ? JSON.parse(storedOptimizationResult) : null,
          optimizedResumeUrl: storedOptimizedUrl,
        };
      }
    } catch (error) {
      // Failed to load from local storage
    }
    return null;
  };

  // Save to local storage
  const saveToStorage = (
    result: AnalysisResult | null,
    viewState: ViewState,
    analysisId: string | null,
    resumeId: string | null,
    jobTitle: string,
    jobDescription: string,
    optimizationResult?: any,
    optimizedResumeUrl?: string | null
  ) => {
    try {
      if (result) {
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULT, JSON.stringify(result));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULT);
      }
      localStorage.setItem(STORAGE_KEYS.VIEW_STATE, viewState);
      if (analysisId) {
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_ID, analysisId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ANALYSIS_ID);
      }
      if (resumeId) {
        localStorage.setItem(STORAGE_KEYS.RESUME_ID, resumeId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.RESUME_ID);
      }
      if (jobTitle) {
        localStorage.setItem(STORAGE_KEYS.JOB_TITLE, jobTitle);
      } else {
        localStorage.removeItem(STORAGE_KEYS.JOB_TITLE);
      }
      if (jobDescription) {
        localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTION, jobDescription);
      } else {
        localStorage.removeItem(STORAGE_KEYS.JOB_DESCRIPTION);
      }
      // Save optimization result if provided
      if (optimizationResult) {
        localStorage.setItem(STORAGE_KEYS.OPTIMIZATION_RESULT, JSON.stringify(optimizationResult));
      }
      // Save optimized resume URL if provided
      if (optimizedResumeUrl) {
        localStorage.setItem(STORAGE_KEYS.OPTIMIZED_RESUME_URL, optimizedResumeUrl);
      }
    } catch (error) {
      // Failed to save to local storage
    }
  };

  // Clear local storage
  const clearStorage = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      // Failed to clear local storage
    }
  };

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

  // Optimization hook - will be initialized when analysisId is available
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
    isRunning: isOptimizing,
    isComplete: isOptimized,
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
    onError: (err) => {
      // Optimization error handled by hook
    },
    onProgress: (progress) => {
      // Progress handled by hook
    },
  });

  // Local state for optimization results
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
  }, [optimizationStatus, optimizationResult, optimizedResumeUrl, analysisResult, analysisId, resumeId, jobTitle, jobDescription]);

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
    // Clear local storage
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
        // Download the PDF
        AnalysisApiService.downloadResume(pdfResponse.file_url, 'optimized-resume.pdf');
        toast({
          title: 'PDF Generated & Downloaded',
          description: 'Your optimized resume PDF has been generated and downloaded successfully',
        });
      }
      // Go back to comparison view
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
  }, [analysisResult, viewState, analysisId, resumeId, jobTitle, jobDescription, optimizationResult, optimizedResumeUrl]);

  // Render Analysis View (Current Score + Suggestions)
  if (viewState === 'analysis' && analysisResult) {
    return (
      <div className="resume-analysis-flow">
        <div className="analysis-view">
          {/* Header */}
          <div className="view-header">
            <h1>Resume Analysis Complete</h1>
            <Button onClick={() => setViewState('form')} variant="outline">
              ← Start New Analysis
            </Button>
          </div>

          {/* Current ATS Score - Full Width Card */}
          <Card className="score-card">
            <CardHeader>
              <div className="score-header">
                <CardTitle>Current ATS Score</CardTitle>
                {(() => {
                  const { scoreBefore } = getDisplayScores(analysisResult);
                  return (
                    <Badge className={`score-badge score-${getScoreLevel(scoreBefore)}`}>
                      {scoreBefore}/100
                    </Badge>
                  );
                })()}
              </div>
            </CardHeader>
          </Card>

          {/* Breakdown Cards - All 4 in One Row */}
          <div className="breakdown-cards-row">
            <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.keyword_match)}`}>
              <CardContent className="pt-6">
                <div className="breakdown-item-content">
                  <span className="label">Keyword Match</span>
                  <span className="value">{analysisResult.ats_analysis.before.breakdown.keyword_match}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.experience_relevance)}`}>
              <CardContent className="pt-6">
                <div className="breakdown-item-content">
                  <span className="label">Experience Relevance</span>
                  <span className="value">{analysisResult.ats_analysis.before.breakdown.experience_relevance}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.education_match)}`}>
              <CardContent className="pt-6">
                <div className="breakdown-item-content">
                  <span className="label">Education Match</span>
                  <span className="value">{analysisResult.ats_analysis.before.breakdown.education_match}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.structure_quality)}`}>
              <CardContent className="pt-6">
                <div className="breakdown-item-content">
                  <span className="label">Structure Quality</span>
                  <span className="value">{analysisResult.ats_analysis.before.breakdown.structure_quality}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality Feedback */}
          {(analysisResult.resume_quality || analysisResult.comprehensive_feedback) && (
            <ResumeQualityFeedback
              qualityScore={analysisResult.resume_quality || null}
              comprehensiveFeedback={analysisResult.comprehensive_feedback || null}
              atsScore={getDisplayScores(analysisResult).scoreBefore}
            />
          )}

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="insights-grid">
                {analysisResult.ats_analysis.ai_insights.strengths.length > 0 && (
                  <div className="insight-card strengths">
                    <h3>✅ Strengths</h3>
                    <ul>
                      {analysisResult.ats_analysis.ai_insights.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisResult.ats_analysis.ai_insights.weaknesses.length > 0 && (
                  <div className="insight-card weaknesses">
                    <h3>⚠️ Weaknesses</h3>
                    <ul>
                      {analysisResult.ats_analysis.ai_insights.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysisResult.ats_analysis.ai_insights.recommendations.length > 0 && (
                  <div className="insight-card recommendations">
                    <h3>💡 Recommendations</h3>
                    <ul>
                      {analysisResult.ats_analysis.ai_insights.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Optimize Button */}
          <Card className="optimize-action">
            <CardContent className="pt-6">
              <Button 
                onClick={handleStartOptimization} 
                size="lg"
                className="btn-optimize w-full"
                disabled={!isWebSocketConnected}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {!isWebSocketConnected ? 'Connecting...' : 'Optimize Resume & Generate New Version'}
              </Button>
              {!isWebSocketConnected && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Waiting for server connection...
                </p>
              )}
              <p className="optimize-note">
                This will generate an optimized resume with improved ATS score and better keyword alignment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render Optimizing View
  if (viewState === 'optimizing') {
    const handleResetOptimization = () => {
      setViewState('analysis');
    };

    return (
      <div className="resume-analysis-flow relative w-full">
        {/* Reset Button - Top Right */}
        <Button 
          onClick={handleResetOptimization}
          variant="outline"
          size="sm"
          className="absolute top-0 right-0 z-10"
        >
          <X className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <div className="optimizing-view">
          {analysisId && (
            <ProgressTracker
              type="optimization"
              optimizationParams={{
                analysisId,
                progress: optimizationProgress,
                status: optimizationStatus === 'starting' ? 'pending' : optimizationStatus === 'running' ? 'running' : optimizationStatus === 'complete' ? 'complete' : 'failed',
                error: optimizationError || undefined,
              }}
              onComplete={(result) => {
                // Result is already handled by useResumeOptimization hook
                // Just navigate to comparison view
                setViewState('comparison');
              }}
              onError={(error) => {
                toast({
                  title: 'Optimization Failed',
                  description: error,
                  variant: 'destructive',
                });
              }}
            />
          )}
          {optimizationError && (
            <Button 
              onClick={() => setViewState('analysis')} 
              variant="outline" 
              className="mt-4 w-full"
            >
              ← Go Back to Analysis
            </Button>
          )}
        </div>
      </div>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Resume Analysis
          </CardTitle>
          <CardDescription>
            Upload your resume and provide job details to get AI-powered analysis and optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Resume *</Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading || isAnalyzing}
              />
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    disabled={isUploading || isAnalyzing}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium mb-1">Drop your resume here</p>
                  <p className="text-xs text-muted-foreground">or click to browse (PDF, DOC, DOCX - Max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Title Input */}
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="job-title"
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="pl-10"
                disabled={isAnalyzing || isUploading}
                required
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description *</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              disabled={isAnalyzing || isUploading}
              required
            />
            <p className="text-xs text-muted-foreground">
              {jobDescription.length} characters
              {jobDescription.length < 50 && ` (minimum 50 required)`}
            </p>
          </div>

          {/* Progress during Analysis */}
          {showAnalysisProgress && resumeId && jobTitle && jobDescription && (
            <ProgressTracker
              type="analysis"
              analysisParams={{
                resumeId,
                jobDescription: jobDescription.trim(),
                jobTitle: jobTitle.trim(),
              }}
              onComplete={handleAnalysisComplete}
              onError={handleAnalysisError}
            />
          )}

          {analysisError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">{analysisError}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleStartAnalysis}
              disabled={!resumeId || !jobTitle.trim() || !jobDescription.trim() || jobDescription.trim().length < 50 || isAnalyzing || isUploading}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
            {(uploadedFile || jobTitle || jobDescription) && (
              <Button
                onClick={handleStartNew}
                variant="outline"
                disabled={isAnalyzing || isUploading}
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function
function getScoreLevel(score: number): string {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

// Helper function for breakdown item colors
function getBreakdownColorClass(score: number): string {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

export default ResumeAnalysisFlow;
