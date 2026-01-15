import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { ProgressTracker } from "@/components/analysis/ProgressTracker";
import { FileUpload } from "../FileUpload";
import { JobTitleInput } from "../JobTitleInput";
import { JobDescriptionInput } from "../JobDescriptionInput";
import { AnalysisActions } from "../AnalysisActions";

interface ResumeAnalysisFormViewProps {
  uploadedFile: File | null;
  jobTitle: string;
  jobDescription: string;
  resumeId: string | null;
  isUploading: boolean;
  isAnalyzing: boolean;
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

        <AnalysisActions
          canStartAnalysis={canStartAnalysis}
          isAnalyzing={isAnalyzing}
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
