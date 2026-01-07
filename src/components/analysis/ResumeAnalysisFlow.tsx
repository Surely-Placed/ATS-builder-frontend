import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeOptimization } from "@/hooks/useResumeOptimization";
import { useResumeAnalysisStorage } from "@/hooks/useResumeAnalysisStorage";
import ComparisonView from "./ComparisonView";
import { ResumeAnalysisFormView } from "@/components/resume/analysis-form";
import { ResumeAnalysisView } from "@/components/resume/analysis-view";
import { ResumeOptimizingView } from "@/components/resume/ResumeOptimizingView";
import { useToast } from "@/hooks/use-toast";
import {
  useAnalysisState,
  useFileUpload,
  useAnalysisHandlers,
  useOptimizationHandlers,
  useDownloadHandler,
  useWebSocketConnection,
} from "@/hooks/analysis/flow";
import "./ResumeAnalysisFlow.css";

interface ResumeAnalysisFlowProps {
  onComplete?: () => void;
}

const ResumeAnalysisFlow: React.FC<ResumeAnalysisFlowProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveToStorage, clearStorage } = useResumeAnalysisStorage();

  // Initialize hooks
  useWebSocketConnection();

  const {
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
  } = useAnalysisState();

  const {
    uploadedFile,
    resumeId,
    isUploading,
    fileInputRef,
    handleFileSelect,
    handleRemoveFile,
    setResumeId,
    setUploadedFile,
  } = useFileUpload();

  const { loadFromStorage } = useResumeAnalysisStorage();
  const storedData = loadFromStorage();
  const [jobTitle, setJobTitle] = useState(storedData?.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(storedData?.jobDescription || "");

  // Load optimization result from storage on mount and restore state
  useEffect(() => {
    const restoreOptimizationState = async () => {
      if (storedData?.optimizationResult && !optimizationResult) {
        setOptimizationResult(storedData.optimizationResult);
      }
      if (storedData?.optimizedResumeUrl && !optimizedResumeUrl) {
        setOptimizedResumeUrl(storedData.optimizedResumeUrl);
      }

      // If we have optimization result in storage, ensure viewState is 'comparison'
      if (storedData?.optimizationResult) {
        if (viewState !== "comparison") {
          setViewState("comparison");
        }
      } else if (analysisId && analysisResult) {
        // If no optimization result in storage but we have analysisId, check API
        // Check if optimization is complete by looking at analysis result
        const hasOptimization =
          analysisResult.optimized_resume ||
          (analysisResult.analysis?.ats_score_after !== null &&
            analysisResult.analysis?.ats_score_after !== undefined) ||
          analysisResult.ats_analysis?.after;

        if (hasOptimization && viewState === "analysis") {
          // Try to fetch optimization result from API
          try {
            const fetchedAnalysis = await fetchAnalysis();
            if (fetchedAnalysis?.optimized_resume || fetchedAnalysis?.analysis?.ats_score_after) {
              // We have optimization, but need to construct the result
              // For now, just set viewState to comparison
              setViewState("comparison");
            }
          } catch (err) {
            // Failed to fetch - keep current state
          }
        }
      }
    };

    restoreOptimizationState();
  }, []); // Only run on mount

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
    analysisId: analysisId || "",
    onComplete: async (result) => {
      setOptimizationResult(result);
      if (result?.optimized_resume?.file_url) {
        setOptimizedResumeUrl(result.optimized_resume.file_url);
      } else if (analysisId) {
        try {
          const fetchedAnalysis = await fetchAnalysis();
          const url =
            fetchedAnalysis?.resume?.optimized_file_url ||
            fetchedAnalysis?.analysis?.optimized_resume_url ||
            null;
          setOptimizedResumeUrl(url);
        } catch (err) {
          // Failed to fetch analysis after optimization
        }
      }
    },
  });

  const [optimizationResult, setOptimizationResult] = useState(null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState<string | null>(null);

  // Update local state when hook result changes
  useEffect(() => {
    if (optimizationResultHook) {
      setOptimizationResult(optimizationResultHook);
    }
    if (optimizedResumeUrlHook) {
      setOptimizedResumeUrl(optimizedResumeUrlHook);
    }
  }, [optimizationResultHook, optimizedResumeUrlHook]);

  const { handleAnalysisComplete, handleAnalysisError, handleStartAnalysis } = useAnalysisHandlers({
    setAnalysisResult,
    setAnalysisId,
    setIsAnalyzing,
    setShowAnalysisProgress,
    setViewState,
    setAnalysisError,
    saveToStorage,
    resumeId,
    jobTitle,
    jobDescription,
    onComplete,
  });

  const { handleStartOptimization } = useOptimizationHandlers({
    analysisId,
    isWebSocketConnected,
    startOptimization,
    setViewState,
  });

  const { isDownloading, handleDownload } = useDownloadHandler({
    optimizedResumeUrl,
    optimizationResult,
    analysisId,
    downloadResume,
  });

  // Auto-navigate to comparison when optimization completes
  useEffect(() => {
    if (optimizationStatus === "complete" && optimizationResult && analysisId) {
      setViewState("comparison");
      saveToStorage(
        analysisResult,
        "comparison",
        analysisId,
        resumeId,
        jobTitle,
        jobDescription,
        optimizationResult,
        optimizedResumeUrl
      );
      // Update URL to include analysisId for proper state persistence
      navigate(`/resume-optimization?analysisId=${analysisId}`, { replace: true });
    }
  }, [
    optimizationStatus,
    optimizationResult,
    optimizedResumeUrl,
    analysisResult,
    analysisId,
    resumeId,
    jobTitle,
    jobDescription,
    saveToStorage,
    navigate,
    setViewState,
  ]);

  const handleStartNew = () => {
    // Clear all state
    setViewState("form");
    setAnalysisResult(null);
    setAnalysisId(null);
    setJobTitle("");
    setJobDescription("");
    setUploadedFile(null);
    setResumeId(null);
    setOptimizationResult(null);
    setOptimizedResumeUrl(null);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear all storage
    clearStorage();

    // Navigate to clean URL (remove analysisId from URL)
    navigate("/resume-optimization", { replace: true });
  };

  const handlePreview = () => {
    if (!analysisId) {
      toast({
        title: "Error",
        description: "Analysis ID not found",
        variant: "destructive",
      });
      return;
    }
    navigate(`/resume-preview/${analysisId}`);
  };

  // Save to storage whenever relevant state changes
  useEffect(() => {
    if (analysisResult && viewState !== "form") {
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
  }, [
    analysisResult,
    viewState,
    analysisId,
    resumeId,
    jobTitle,
    jobDescription,
    optimizationResult,
    optimizedResumeUrl,
    saveToStorage,
  ]);

  // Preview is now handled by separate route (/resume-preview/:analysisId)
  useEffect(() => {
    if (viewState === "preview" && analysisId) {
      navigate(`/resume-preview/${analysisId}`, { replace: true });
    }
  }, [viewState, analysisId, navigate]);

  // Render Analysis View
  if (viewState === "analysis" && analysisResult) {
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
  if (viewState === "optimizing" && analysisId) {
    const optimizationStatusMapped =
      optimizationStatus === "starting"
        ? "pending"
        : optimizationStatus === "running"
          ? "running"
          : optimizationStatus === "complete"
            ? "complete"
            : "failed";

    const errorToPass =
      optimizationStatus === "failed" ? optimizationError || undefined : undefined;

    return (
      <ResumeOptimizingView
        analysisId={analysisId}
        progress={optimizationProgress}
        status={optimizationStatusMapped}
        error={errorToPass}
        onReset={() => setViewState("analysis")}
        onComplete={() => setViewState("comparison")}
        onError={(error) => {
          if (optimizationStatus === "failed") {
            toast({
              title: "Optimization Failed",
              description: error,
              variant: "destructive",
            });
          }
        }}
      />
    );
  }

  // Render Comparison View
  if (viewState === "comparison" && analysisResult && optimizationResult) {
    return (
      <ComparisonView
        originalAnalysis={analysisResult}
        optimizedResult={optimizationResult}
        onDownload={handleDownload}
        onStartNew={handleStartNew}
        onPreview={handlePreview}
        isPreviewLoading={false}
        isDownloadLoading={isDownloading}
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
