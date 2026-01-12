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
} from "@/hooks/analysis/flow";
import "./ResumeAnalysisFlow.css";
import { ToastProps } from "@radix-ui/react-toast";
import { VariantProps } from "class-variance-authority";
import { ClassProp } from "class-variance-authority/types";
import { ToastActionElement } from "../ui/toast";

interface ResumeAnalysisFlowProps {
  onComplete?: () => void;
}

const ResumeAnalysisFlow: React.FC<ResumeAnalysisFlowProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saveToStorage, clearStorage, setAnalysisInProgress, isAnalysisInProgress } = useResumeAnalysisStorage();

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
  
  // Check if this is a fresh start - don't load from storage
  const isFreshStart = sessionStorage.getItem('resume_fresh_start') === 'true';
  const storedData = isFreshStart ? null : loadFromStorage();
  
  const [jobTitle, setJobTitle] = useState(isFreshStart ? "" : (storedData?.jobTitle || ""));
  const [jobDescription, setJobDescription] = useState(isFreshStart ? "" : (storedData?.jobDescription || ""));

  // Restore resumeId from storage if not already set (skip if fresh start)
  useEffect(() => {
    if (!isFreshStart && storedData?.resumeId && !resumeId) {
      setResumeId(storedData.resumeId);
    }
  }, [storedData?.resumeId, resumeId, setResumeId, isFreshStart]);

  // Save form data (resumeId, jobTitle, jobDescription) to storage whenever they change
  useEffect(() => {
    if (resumeId || jobTitle || jobDescription) {
      // Save to storage even if analysisResult doesn't exist yet
      // This ensures form data persists across refreshes
      if (analysisResult) {
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
      } else {
        // Save just the form data even without analysis result
        try {
          // Instead of directly using localStorage, we'll use saveToStorage
          // with partial data, but saveToStorage expects full analysis result
          // So we'll temporarily update with null/empty values for missing data
          saveToStorage(
            analysisResult || null,
            viewState,
            analysisId || null,
            resumeId,
            jobTitle,
            jobDescription,
            optimizationResult,
            optimizedResumeUrl
          );
        } catch (error) {
          // Failed to save
        }
      }
    }
  }, [resumeId, jobTitle, jobDescription]);

  // Load optimization result from storage on mount and restore state
  useEffect(() => {
    const restoreOptimizationState = async () => {
      // Check if the URL has an analysisId parameter
      const urlParams = new URLSearchParams(window.location.search);
      const hasUrlAnalysisId = urlParams.get('analysisId') !== null;
      
      // Only restore state if there's an analysisId in the URL (user navigated directly to a specific analysis)
      // Don't restore if the user explicitly navigated to a clean URL (like after clicking "Analyze Another Resume")
      if (!hasUrlAnalysisId && viewState === 'form') {
        // User is on form view without URL analysisId, don't restore anything
        return;
      }
      
      // Check if analysis was in progress but page was refreshed
      // If we have resumeId, jobTitle, jobDescription but no analysisResult, check if analysis completed
      if (!analysisResult && resumeId && jobTitle && jobDescription && analysisId) {
        try {
          const fetchedAnalysis = await fetchAnalysis();
          if (fetchedAnalysis?.analysis?.id) {
            // Analysis exists and is complete
            setAnalysisResult(fetchedAnalysis);
            setIsAnalyzing(false);
            setShowAnalysisProgress(false);
            
            // Check if optimization is also complete
            const hasOptimization =
              fetchedAnalysis?.optimized_resume ||
              (fetchedAnalysis?.analysis?.ats_score_after !== null &&
                fetchedAnalysis?.analysis?.ats_score_after !== undefined) ||
              fetchedAnalysis?.ats_analysis?.after;
            
            if (hasOptimization) {
              setViewState("comparison");
            } else {
              setViewState("analysis");
            }
          }
          } catch (err) {
            // Analysis might not exist or still in progress
            // Check if analysis was in progress
            const analysisInProgress = isAnalysisInProgress();
            if (analysisInProgress) {
              setIsAnalyzing(true);
              setShowAnalysisProgress(true);
            }
          }
      }
      
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
        
        // If we're in "optimizing" state, check if optimization is actually complete
        // This handles page refresh scenarios where state was lost
        if (viewState === "optimizing" && analysisId) {
          try {
            const fetchedAnalysis = await fetchAnalysis();
            const isComplete =
              fetchedAnalysis?.optimized_resume ||
              (fetchedAnalysis?.analysis?.ats_score_after !== null &&
                fetchedAnalysis?.analysis?.ats_score_after !== undefined) ||
              fetchedAnalysis?.ats_analysis?.after;
            
            if (isComplete) {
              // Optimization is complete, transition to comparison view
              setViewState("comparison");
            } else {
              // Optimization is still in progress, keep optimizing state
              // The polling hook will handle checking status via analysisId
              // No action needed here - hook will automatically resume polling
            }
          } catch (err) {
            // Failed to fetch - keep optimizing state and let polling handle it
          }
        }
      } else if (viewState === "optimizing" && analysisId) {
        // We're in optimizing state but don't have analysisResult yet
        // This can happen after page refresh - polling hook will handle checking status
        // No action needed, hook will automatically check via analysisId
      }
      
      // Check if we should be in analyzing state (if stored viewState was "analyzing" or we have params but no result)
      if (viewState === "form" && resumeId && jobTitle && jobDescription && !analysisResult) {
        // We have all the form data but no analysis result
        // Check if analysis is in progress or completed
        if (analysisId) {
          try {
            const fetchedAnalysis = await fetchAnalysis();
            if (fetchedAnalysis?.analysis?.id) {
              // Analysis exists - restore it
              setAnalysisResult(fetchedAnalysis);
              setIsAnalyzing(false);
              setShowAnalysisProgress(false);
              
              const hasOptimization =
                fetchedAnalysis?.optimized_resume ||
                (fetchedAnalysis?.analysis?.ats_score_after !== null &&
                  fetchedAnalysis?.analysis?.ats_score_after !== undefined) ||
                fetchedAnalysis?.ats_analysis?.after;
              
              setViewState(hasOptimization ? "comparison" : "analysis");
            }
          } catch (err) {
            // Analysis might be in progress - check if analysis was in progress
            const analysisInProgress = isAnalysisInProgress();
            if (analysisInProgress) {
              setIsAnalyzing(true);
              setShowAnalysisProgress(true);
            }
          }
        } else {
          // Check if analysis was in progress
          const analysisInProgress = isAnalysisInProgress();
          if (analysisInProgress) {
            setIsAnalyzing(true);
            setShowAnalysisProgress(true);
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
    isConnected: isStatusUpdatesConnected,
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
    setAnalysisInProgress,
    resumeId,
    jobTitle,
    jobDescription,
    onComplete,
  });

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
    // Set a flag to indicate fresh start - this prevents useEffects from restoring old data
    sessionStorage.setItem('resume_fresh_start', 'true');
    
    // IMPORTANT: Clear storage FIRST before any state changes
    // This prevents useEffect hooks from restoring old data
    clearStorage();
    
    // Also manually clear any remaining localStorage keys that might be missed
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('resume_') || 
        key.startsWith('optimization_') ||
        key.startsWith('analysis_')
      )) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

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

    // Navigate to clean URL (remove analysisId from URL)
    // Use window.location for a full page navigation to ensure clean state
    window.location.href = "/resume-optimization";
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
        isStatusUpdatesConnected={isStatusUpdatesConnected}
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
        onReset={() => {
          setViewState("analysis");
          // Clear the URL parameters to prevent restoration logic from running
          navigate("/resume-optimization", { replace: true });
        }}
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
function useCallback(arg0: (error: string) => void, arg1: ((({ ...props }: { open?: boolean; slot?: string | undefined; style?: React.CSSProperties | undefined; title?: string & React.ReactNode; key?: React.Key | null | undefined; value?: string | readonly string[] | number | undefined; defaultChecked?: boolean | undefined; defaultValue?: string | number | readonly string[] | undefined; suppressContentEditableWarning?: boolean | undefined; suppressHydrationWarning?: boolean | undefined; accessKey?: string | undefined; autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters" | undefined | (string & {}); autoFocus?: boolean | undefined; className?: string | undefined; contentEditable?: (boolean | "true" | "false") | "inherit" | "plaintext-only" | undefined; contextMenu?: string | undefined; dir?: string | undefined; draggable?: (boolean | "true" | "false") | undefined; enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send" | undefined; hidden?: boolean | undefined; lang?: string | undefined; nonce?: string | undefined; spellCheck?: (boolean | "true" | "false") | undefined; tabIndex?: number | undefined; translate?: "yes" | "no" | undefined; radioGroup?: string | undefined; role?: React.AriaRole | undefined; about?: string | undefined; content?: string | undefined; datatype?: string | undefined; inlist?: any; prefix?: string | undefined; property?: string | undefined; rel?: string | undefined; resource?: string | undefined; rev?: string | undefined; typeof?: string | undefined; vocab?: string | undefined; autoCorrect?: string | undefined; autoSave?: string | undefined; color?: string | undefined; itemProp?: string | undefined; itemScope?: boolean | undefined; itemType?: string | undefined; itemID?: string | undefined; itemRef?: string | undefined; results?: number | undefined; security?: string | undefined; unselectable?: "on" | "off" | undefined; inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined; is?: string | undefined; exportparts?: string | undefined; part?: string | undefined; "aria-activedescendant"?: string | undefined; "aria-atomic"?: (boolean | "true" | "false") | undefined; "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined; "aria-braillelabel"?: string | undefined; "aria-brailleroledescription"?: string | undefined; "aria-busy"?: (boolean | "true" | "false") | undefined; "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined; "aria-colcount"?: number | undefined; "aria-colindex"?: number | undefined; "aria-colindextext"?: string | undefined; "aria-colspan"?: number | undefined; "aria-controls"?: string | undefined; "aria-current"?: boolean | "false" | "true" | "page" | "step" | "location" | "date" | "time" | undefined; "aria-describedby"?: string | undefined; "aria-description"?: string | undefined; "aria-details"?: string | undefined; "aria-disabled"?: (boolean | "true" | "false") | undefined; "aria-dropeffect"?: "none" | "copy" | "execute" | "link" | "move" | "popup" | undefined; "aria-errormessage"?: string | undefined; "aria-expanded"?: (boolean | "true" | "false") | undefined; "aria-flowto"?: string | undefined; "aria-grabbed"?: (boolean | "true" | "false") | undefined; "aria-haspopup"?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog" | undefined; "aria-hidden"?: (boolean | "true" | "false") | undefined; "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling" | undefined; "aria-keyshortcuts"?: string | undefined; "aria-label"?: string | undefined; "aria-labelledby"?: string | undefined; "aria-level"?: number | undefined; "aria-live"?: "off" | "assertive" | "polite" | undefined; "aria-modal"?: (boolean | "true" | "false") | undefined; "aria-multiline"?: (boolean | "true" | "false") | undefined; "aria-multiselectable"?: (boolean | "true" | "false") | undefined; "aria-orientation"?: "horizontal" | "vertical" | undefined; "aria-owns"?: string | undefined; "aria-placeholder"?: string | undefined; "aria-posinset"?: number | undefined; "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined; "aria-readonly"?: (boolean | "true" | "false") | undefined; "aria-relevant"?: "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text" | "text additions" | "text removals" | undefined; "aria-required"?: (boolean | "true" | "false") | undefined; "aria-roledescription"?: string | undefined; "aria-rowcount"?: number | undefined; "aria-rowindex"?: number | undefined; "aria-rowindextext"?: string | undefined; "aria-rowspan"?: number | undefined; "aria-selected"?: (boolean | "true" | "false") | undefined; "aria-setsize"?: number | undefined; "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined; "aria-valuemax"?: number | undefined; "aria-valuemin"?: number | undefined; "aria-valuenow"?: number | undefined; "aria-valuetext"?: string | undefined; children?: React.ReactNode | undefined; dangerouslySetInnerHTML?: { __html: string | TrustedHTML; } | undefined; onCopy?: React.ClipboardEventHandler<HTMLLIElement>; onCopyCapture?: React.ClipboardEventHandler<HTMLLIElement>; onCut?: React.ClipboardEventHandler<HTMLLIElement>; onCutCapture?: React.ClipboardEventHandler<HTMLLIElement>; onPaste?: React.ClipboardEventHandler<HTMLLIElement>; onPasteCapture?: React.ClipboardEventHandler<HTMLLIElement>; onCompositionEnd?: React.CompositionEventHandler<HTMLLIElement>; onCompositionEndCapture?: React.CompositionEventHandler<HTMLLIElement>; onCompositionStart?: React.CompositionEventHandler<HTMLLIElement>; onCompositionStartCapture?: React.CompositionEventHandler<HTMLLIElement>; onCompositionUpdate?: React.CompositionEventHandler<HTMLLIElement>; onCompositionUpdateCapture?: React.CompositionEventHandler<HTMLLIElement>; onFocus?: React.FocusEventHandler<HTMLLIElement>; onFocusCapture?: React.FocusEventHandler<HTMLLIElement>; onBlur?: React.FocusEventHandler<HTMLLIElement>; onBlurCapture?: React.FocusEventHandler<HTMLLIElement>; onChange?: React.FormEventHandler<HTMLLIElement>; onChangeCapture?: React.FormEventHandler<HTMLLIElement>; onBeforeInput?: React.InputEventHandler<HTMLLIElement>; onBeforeInputCapture?: React.FormEventHandler<HTMLLIElement>; onInput?: React.FormEventHandler<HTMLLIElement>; onInputCapture?: React.FormEventHandler<HTMLLIElement>; onReset?: React.FormEventHandler<HTMLLIElement>; onResetCapture?: React.FormEventHandler<HTMLLIElement>; onSubmit?: React.FormEventHandler<HTMLLIElement>; onSubmitCapture?: React.FormEventHandler<HTMLLIElement>; onInvalid?: React.FormEventHandler<HTMLLIElement>; onInvalidCapture?: React.FormEventHandler<HTMLLIElement>; onLoad?: React.ReactEventHandler<HTMLLIElement>; onLoadCapture?: React.ReactEventHandler<HTMLLIElement>; onError?: React.ReactEventHandler<HTMLLIElement>; onErrorCapture?: React.ReactEventHandler<HTMLLIElement>; onKeyDown?: React.KeyboardEventHandler<HTMLLIElement>; onKeyDownCapture?: React.KeyboardEventHandler<HTMLLIElement>; onKeyPress?: React.KeyboardEventHandler<HTMLLIElement>; onKeyPressCapture?: React.KeyboardEventHandler<HTMLLIElement>; onKeyUp?: React.KeyboardEventHandler<HTMLLIElement>; onKeyUpCapture?: React.KeyboardEventHandler<HTMLLIElement>; onAbort?: React.ReactEventHandler<HTMLLIElement>; onAbortCapture?: React.ReactEventHandler<HTMLLIElement>; onCanPlay?: React.ReactEventHandler<HTMLLIElement>; onCanPlayCapture?: React.ReactEventHandler<HTMLLIElement>; onCanPlayThrough?: React.ReactEventHandler<HTMLLIElement>; onCanPlayThroughCapture?: React.ReactEventHandler<HTMLLIElement>; onDurationChange?: React.ReactEventHandler<HTMLLIElement>; onDurationChangeCapture?: React.ReactEventHandler<HTMLLIElement>; onEmptied?: React.ReactEventHandler<HTMLLIElement>; onEmptiedCapture?: React.ReactEventHandler<HTMLLIElement>; onEncrypted?: React.ReactEventHandler<HTMLLIElement>; onEncryptedCapture?: React.ReactEventHandler<HTMLLIElement>; onEnded?: React.ReactEventHandler<HTMLLIElement>; onEndedCapture?: React.ReactEventHandler<HTMLLIElement>; onLoadedData?: React.ReactEventHandler<HTMLLIElement>; onLoadedDataCapture?: React.ReactEventHandler<HTMLLIElement>; onLoadedMetadata?: React.ReactEventHandler<HTMLLIElement>; onLoadedMetadataCapture?: React.ReactEventHandler<HTMLLIElement>; onLoadStart?: React.ReactEventHandler<HTMLLIElement>; onLoadStartCapture?: React.ReactEventHandler<HTMLLIElement>; onPause?: () => void; onPauseCapture?: React.ReactEventHandler<HTMLLIElement>; onPlay?: React.ReactEventHandler<HTMLLIElement>; onPlayCapture?: React.ReactEventHandler<HTMLLIElement>; onPlaying?: React.ReactEventHandler<HTMLLIElement>; onPlayingCapture?: React.ReactEventHandler<HTMLLIElement>; onProgress?: React.ReactEventHandler<HTMLLIElement>; onProgressCapture?: React.ReactEventHandler<HTMLLIElement>; onRateChange?: React.ReactEventHandler<HTMLLIElement>; onRateChangeCapture?: React.ReactEventHandler<HTMLLIElement>; onSeeked?: React.ReactEventHandler<HTMLLIElement>; onSeekedCapture?: React.ReactEventHandler<HTMLLIElement>; onSeeking?: React.ReactEventHandler<HTMLLIElement>; onSeekingCapture?: React.ReactEventHandler<HTMLLIElement>; onStalled?: React.ReactEventHandler<HTMLLIElement>; onStalledCapture?: React.ReactEventHandler<HTMLLIElement>; onSuspend?: React.ReactEventHandler<HTMLLIElement>; onSuspendCapture?: React.ReactEventHandler<HTMLLIElement>; onTimeUpdate?: React.ReactEventHandler<HTMLLIElement>; onTimeUpdateCapture?: React.ReactEventHandler<HTMLLIElement>; onVolumeChange?: React.ReactEventHandler<HTMLLIElement>; onVolumeChangeCapture?: React.ReactEventHandler<HTMLLIElement>; onWaiting?: React.ReactEventHandler<HTMLLIElement>; onWaitingCapture?: React.ReactEventHandler<HTMLLIElement>; onAuxClick?: React.MouseEventHandler<HTMLLIElement>; onAuxClickCapture?: React.MouseEventHandler<HTMLLIElement>; onClick?: React.MouseEventHandler<HTMLLIElement>; onClickCapture?: React.MouseEventHandler<HTMLLIElement>; onContextMenu?: React.MouseEventHandler<HTMLLIElement>; onContextMenuCapture?: React.MouseEventHandler<HTMLLIElement>; onDoubleClick?: React.MouseEventHandler<HTMLLIElement>; onDoubleClickCapture?: React.MouseEventHandler<HTMLLIElement>; onDrag?: React.DragEventHandler<HTMLLIElement>; onDragCapture?: React.DragEventHandler<HTMLLIElement>; onDragEnd?: React.DragEventHandler<HTMLLIElement>; onDragEndCapture?: React.DragEventHandler<HTMLLIElement>; onDragEnter?: React.DragEventHandler<HTMLLIElement>; onDragEnterCapture?: React.DragEventHandler<HTMLLIElement>; onDragExit?: React.DragEventHandler<HTMLLIElement>; onDragExitCapture?: React.DragEventHandler<HTMLLIElement>; onDragLeave?: React.DragEventHandler<HTMLLIElement>; onDragLeaveCapture?: React.DragEventHandler<HTMLLIElement>; onDragOver?: React.DragEventHandler<HTMLLIElement>; onDragOverCapture?: React.DragEventHandler<HTMLLIElement>; onDragStart?: React.DragEventHandler<HTMLLIElement>; onDragStartCapture?: React.DragEventHandler<HTMLLIElement>; onDrop?: React.DragEventHandler<HTMLLIElement>; onDropCapture?: React.DragEventHandler<HTMLLIElement>; onMouseDown?: React.MouseEventHandler<HTMLLIElement>; onMouseDownCapture?: React.MouseEventHandler<HTMLLIElement>; onMouseEnter?: React.MouseEventHandler<HTMLLIElement>; onMouseLeave?: React.MouseEventHandler<HTMLLIElement>; onMouseMove?: React.MouseEventHandler<HTMLLIElement>; onMouseMoveCapture?: React.MouseEventHandler<HTMLLIElement>; onMouseOut?: React.MouseEventHandler<HTMLLIElement>; onMouseOutCapture?: React.MouseEventHandler<HTMLLIElement>; onMouseOver?: React.MouseEventHandler<HTMLLIElement>; onMouseOverCapture?: React.MouseEventHandler<HTMLLIElement>; onMouseUp?: React.MouseEventHandler<HTMLLIElement>; onMouseUpCapture?: React.MouseEventHandler<HTMLLIElement>; onSelect?: React.ReactEventHandler<HTMLLIElement>; onSelectCapture?: React.ReactEventHandler<HTMLLIElement>; onTouchCancel?: React.TouchEventHandler<HTMLLIElement>; onTouchCancelCapture?: React.TouchEventHandler<HTMLLIElement>; onTouchEnd?: React.TouchEventHandler<HTMLLIElement>; onTouchEndCapture?: React.TouchEventHandler<HTMLLIElement>; onTouchMove?: React.TouchEventHandler<HTMLLIElement>; onTouchMoveCapture?: React.TouchEventHandler<HTMLLIElement>; onTouchStart?: React.TouchEventHandler<HTMLLIElement>; onTouchStartCapture?: React.TouchEventHandler<HTMLLIElement>; onPointerDown?: React.PointerEventHandler<HTMLLIElement>; onPointerDownCapture?: React.PointerEventHandler<HTMLLIElement>; onPointerMove?: React.PointerEventHandler<HTMLLIElement>; onPointerMoveCapture?: React.PointerEventHandler<HTMLLIElement>; onPointerUp?: React.PointerEventHandler<HTMLLIElement>; onPointerUpCapture?: React.PointerEventHandler<HTMLLIElement>; onPointerCancel?: React.PointerEventHandler<HTMLLIElement>; onPointerCancelCapture?: React.PointerEventHandler<HTMLLIElement>; onPointerEnter?: React.PointerEventHandler<HTMLLIElement>; onPointerLeave?: React.PointerEventHandler<HTMLLIElement>; onPointerOver?: React.PointerEventHandler<HTMLLIElement>; onPointerOverCapture?: React.PointerEventHandler<HTMLLIElement>; onPointerOut?: React.PointerEventHandler<HTMLLIElement>; onPointerOutCapture?: React.PointerEventHandler<HTMLLIElement>; onGotPointerCapture?: React.PointerEventHandler<HTMLLIElement>; onGotPointerCaptureCapture?: React.PointerEventHandler<HTMLLIElement>; onLostPointerCapture?: React.PointerEventHandler<HTMLLIElement>; onLostPointerCaptureCapture?: React.PointerEventHandler<HTMLLIElement>; onScroll?: React.UIEventHandler<HTMLLIElement>; onScrollCapture?: React.UIEventHandler<HTMLLIElement>; onWheel?: React.WheelEventHandler<HTMLLIElement>; onWheelCapture?: React.WheelEventHandler<HTMLLIElement>; onAnimationStart?: React.AnimationEventHandler<HTMLLIElement>; onAnimationStartCapture?: React.AnimationEventHandler<HTMLLIElement>; onAnimationEnd?: React.AnimationEventHandler<HTMLLIElement>; onAnimationEndCapture?: React.AnimationEventHandler<HTMLLIElement>; onAnimationIteration?: React.AnimationEventHandler<HTMLLIElement>; onAnimationIterationCapture?: React.AnimationEventHandler<HTMLLIElement>; onTransitionEnd?: React.TransitionEventHandler<HTMLLIElement>; onTransitionEndCapture?: React.TransitionEventHandler<HTMLLIElement>; asChild?: boolean; type?: "foreground" | "background"; duration?: number; onEscapeKeyDown?: (event: KeyboardEvent) => void; onResume?: () => void; onSwipeStart?: (event: { currentTarget: EventTarget & HTMLLIElement; } & Omit<CustomEvent<{ originalEvent: React.PointerEvent; delta: { x: number; y: number; }; }>, "currentTarget">) => void; onSwipeMove?: (event: { currentTarget: EventTarget & HTMLLIElement; } & Omit<CustomEvent<{ originalEvent: React.PointerEvent; delta: { x: number; y: number; }; }>, "currentTarget">) => void; onSwipeCancel?: (event: { currentTarget: EventTarget & HTMLLIElement; } & Omit<CustomEvent<{ originalEvent: React.PointerEvent; delta: { x: number; y: number; }; }>, "currentTarget">) => void; onSwipeEnd?: (event: { currentTarget: EventTarget & HTMLLIElement; } & Omit<CustomEvent<{ originalEvent: React.PointerEvent; delta: { x: number; y: number; }; }>, "currentTarget">) => void; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; forceMount?: true; action?: ToastActionElement; variant?: "default" | "destructive"; description?: React.ReactNode; }) => { id: string; dismiss: () => void; update: (props: Omit<Omit<ToastProps & React.RefAttributes<HTMLLIElement>, "ref"> & VariantProps<(props?: { variant?: "default" | "destructive"; } & ClassProp) => string> & React.RefAttributes<HTMLLIElement>, "ref"> & { id: string; title?: React.ReactNode; description?: React.ReactNode; action?: ToastActionElement; }) => void; }) | "idle" | "starting" | "running" | "complete" | "failed")[]) {
  throw new Error("Function not implemented.");
}

