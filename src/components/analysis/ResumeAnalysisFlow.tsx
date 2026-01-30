import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeOptimization } from "@/hooks/useResumeOptimization";
import { ResumeAnalysisFormView } from "@/components/resume/analysis-form";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  useAnalysisState,

  useFileUpload,
  useAnalysisHandlers,
  useOptimizationHandlers,
  useDownloadHandler,
} from "@/hooks/analysis/flow";
import "./ResumeAnalysisFlow.css";
import { useRestoreOptimizationState } from "./hooks/useRestoreOptimizationState";
import { useEnforceViewState } from "./hooks/useEnforceViewState";
import { useFlowActions } from "./hooks/useFlowActions";
// debug utilities removed
import { mapOptimizationStatus } from '@/utils/analysis/optimizationStatusMapper';

type ResumeAnalysisFlowProps = {
  onComplete?: () => void;
};

const ResumeAnalysisFlow: React.FC<ResumeAnalysisFlowProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Ref to track if analysis/optimization is in progress for beforeunload
  const isProcessingRef = useRef(false);

  // Update ref when state changes
  useEffect(() => {
    isProcessingRef.current = isAnalyzing || viewState === "optimizing";
  }, [isAnalyzing, viewState]);

  // Clear storage when user refreshes or leaves the page during analysis/optimization
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isProcessingRef.current) {
        // Show browser's default "Leave site?" dialog
        event.preventDefault();
        // For older browsers
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  // moved complex restoration logic into hook to reduce file size

  const {
    status: optimizationStatus,
    progress: optimizationProgress,
    result: optimizationResultHook,
    error: optimizationError,
    optimizedResumeUrl: optimizedResumeUrlHook,
    startOptimization,
    fetchAnalysis,
    downloadResume,
    isConnected: isStatusUpdatesConnected,
    cancelOptimization,
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

  // Ref to hold cancel function for analysis progress
  const cancelAnalysisRef = useRef<() => void | null>(null);

  const handleCancelAvailable = (cancelFn: () => void) => {
    cancelAnalysisRef.current = cancelFn;
  };

    // extract the big restore-on-mount logic into a hook
    useRestoreOptimizationState({
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
      analysisInProgress: () => false,
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

  // Automatically start optimization when viewState becomes "optimizing"
  // This is the key to the unified flow - no manual "Optimize" button needed
  const lastTriggeredAnalysisIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (viewState === "optimizing" && analysisId && lastTriggeredAnalysisIdRef.current !== analysisId) {
      lastTriggeredAnalysisIdRef.current = analysisId;
      // Automatically trigger optimization
      startOptimization().catch((err) => {
        console.error("Auto-optimization failed:", err);
        setViewState("form");
        toast({
          title: "Optimization Failed",
          description: err.message || "Failed to start optimization automatically",
          variant: "destructive",
        });
      });
    }
    
    // Reset the tracker if we leave the optimizing view for a long enough time or if id is cleared
    if (viewState !== "optimizing" || !analysisId) {
      lastTriggeredAnalysisIdRef.current = null;
    }
  }, [viewState, analysisId, startOptimization, setViewState, toast]);







  const { handleAnalysisComplete: handleAnalysisCompleteBase, handleAnalysisError, handleStartAnalysis } = useAnalysisHandlers({
    setAnalysisResult,
    setAnalysisId,
    setIsAnalyzing,
    setShowAnalysisProgress,
    setViewState,
    setAnalysisError,
    // saveToStorage removed
    resumeId,
    jobTitle,
    jobDescription,
    onComplete,
  });

  // Wrap handleAnalysisComplete to set waiting state immediately
  // This prevents the "Start Analysis" button from flashing when analysis ends but optimization view hasn't loaded yet
  const handleAnalysisComplete = (result: any) => {
    handleAnalysisCompleteBase(result);
  };

  const handleOptimizationComplete = (result: any) => {
    console.log("Optimization complete:", result);
    if (analysisId) {
      navigate(`/resume-comparison?analysisId=${analysisId}`, { replace: true });
    }
  };


  const { handleStartOptimization } = useOptimizationHandlers({
    analysisId,
    startOptimization,
    setViewState,
  });

  const { isDownloading, handleDownload } = useDownloadHandler({
    optimizedResumeUrl,
    optimizationResult,
    analysisId,
    downloadResume,
  });

  // moved auto-navigation and start/reset handlers into a hook to reduce file size
  const { handleStartNew, handlePreview } = useFlowActions({
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
    cancelOptimization,
    cancelAnalysis: () => cancelAnalysisRef.current && cancelAnalysisRef.current(),
  });


  // handlers provided by useFlowActions



  // Preview is now handled by separate route (/resume-preview/:analysisId)
  useEffect(() => {
    if (viewState === "preview" && analysisId) {
      navigate(`/resume-preview/${analysisId}`, { replace: true });
    }
  }, [viewState, analysisId, navigate]);


  // move URL + view-state enforcement into a small hook
  useEnforceViewState({
    viewState,
    setViewState,
    analysisId,
    analysisResult,
    optimizationResult,
    optimizationStatus,
    navigate,
  });

  
  // Comparison view has been removed - we now navigate directly to preview
  // which is handled by a separate route and component (ResumePreview.tsx)
  
  if (viewState === "preview") {
    return null; // Navigation handles this
  }


  // Render Form View (Default)
  return (
    <div className="resume-analysis-flow">
      {/* Debug panel removed */}
      <ResumeAnalysisFormView
        uploadedFile={uploadedFile}
        jobTitle={jobTitle}
        jobDescription={jobDescription}
        resumeId={resumeId}
        isUploading={isUploading}
        isAnalyzing={isAnalyzing}
        isOptimizing={viewState === "optimizing"}
        hasAnalysisId={!!analysisId}
        analysisId={analysisId || ""}
        optimizationStatus={optimizationStatus}
        optimizationProgress={optimizationProgress}
        optimizationError={optimizationError}
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
        onOptimizationComplete={handleOptimizationComplete}
        onAnalysisError={handleAnalysisError}

        onCancelAvailable={handleCancelAvailable}
      />
    </div>
  );
};

export default ResumeAnalysisFlow;