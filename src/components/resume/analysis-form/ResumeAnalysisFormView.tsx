import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { ProgressTracker } from "@/components/analysis/ProgressTracker";
import { FileUpload } from "../FileUpload";
import { JobTitleInput } from "../JobTitleInput";
import { JobDescriptionInput } from "../JobDescriptionInput";
import { AnalysisActions } from "../AnalysisActions";
import { mapOptimizationStatus } from "@/utils/analysis/optimizationStatusMapper";


interface ResumeAnalysisFormViewProps {
  uploadedFile: File | null;
  jobTitle: string;
  jobDescription: string;
  resumeId: string | null;
  isUploading: boolean;
  isAnalyzing: boolean;
  isOptimizing?: boolean;
  hasAnalysisId?: boolean;
  analysisId?: string;
  optimizationStatus?: string;
  optimizationProgress?: number;
  optimizationError?: string;
  analysisError: string | null;
  showAnalysisProgress: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (file: File) => void;
  onJobTitleChange: (title: string) => void;
  onJobDescriptionChange: (description: string) => void;
  onRemoveFile: () => void;
  onStartAnalysis: () => void;
  onReset: () => void;
  onAnalysisComplete: (result: any) => void;
  onOptimizationComplete?: (result: any) => void;
  onAnalysisError: (error: string) => void;
  onCancelAvailable?: (cancel: () => void) => void;
}

export const ResumeAnalysisFormView: React.FC<ResumeAnalysisFormViewProps> = ({
  uploadedFile,
  jobTitle,
  jobDescription,
  resumeId,
  isUploading,
  isAnalyzing,
  isOptimizing = false,
  hasAnalysisId = false,
  analysisId = "",
  optimizationStatus = "idle",
  optimizationProgress = 0,
  optimizationError,
  analysisError,
  showAnalysisProgress,
  fileInputRef,
  onFileSelect,
  onJobTitleChange,
  onJobDescriptionChange,
  onRemoveFile,
  onStartAnalysis,
  onReset,
  onAnalysisComplete,
  onOptimizationComplete,
  onAnalysisError,
  onCancelAvailable,
}) => {
  const canStartAnalysis =
    !!resumeId &&
    !!jobTitle.trim() &&
    !!jobDescription.trim() &&
    jobDescription.trim().length >= 50;
  const hasData = !!uploadedFile || !!jobTitle || !!jobDescription;

  return (
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
        <FileUpload
          uploadedFile={uploadedFile}
          isUploading={isUploading}
          isAnalyzing={isAnalyzing}
          fileInputRef={fileInputRef}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
        />

        <JobTitleInput
          value={jobTitle}
          onChange={onJobTitleChange}
          disabled={isAnalyzing || isUploading}
        />

        <JobDescriptionInput
          value={jobDescription}
          onChange={onJobDescriptionChange}
          disabled={isAnalyzing || isUploading}
        />

        {showAnalysisProgress && resumeId && jobTitle && jobDescription && (
          <ProgressTracker
            type="analysis"
            analysisParams={{
              resumeId,
              jobDescription: jobDescription.trim(),
              jobTitle: jobTitle.trim(),
            }}
            onComplete={onAnalysisComplete}
            onError={onAnalysisError}
            onCancelAvailable={onCancelAvailable}
          />
        )}

        {isOptimizing && analysisId && (
          <ProgressTracker
            type="optimization"
            optimizationParams={{
              analysisId,
              progress: optimizationProgress,
              status: mapOptimizationStatus(optimizationStatus),
              error: optimizationError,
            }}
            onComplete={onOptimizationComplete || onAnalysisComplete}
            onError={onAnalysisError}
          />
        )}


        <AnalysisActions
          canStartAnalysis={canStartAnalysis}
          isAnalyzing={isAnalyzing}
          isOptimizing={isOptimizing}
          hasAnalysisId={hasAnalysisId}
          optimizationStatus={optimizationStatus}
          isUploading={isUploading}
          analysisError={analysisError}
          hasData={hasData}
          onStartAnalysis={onStartAnalysis}
          onReset={onReset}
        />



      </CardContent>
    </Card>
  );
};
