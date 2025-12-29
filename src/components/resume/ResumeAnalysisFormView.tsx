import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProgressTracker } from '../ProgressTracker';
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
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

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
                    onRemoveFile();
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
              onChange={(e) => onJobTitleChange(e.target.value)}
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
            onChange={(e) => onJobDescriptionChange(e.target.value)}
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
            onComplete={onAnalysisComplete}
            onError={onAnalysisError}
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
            onClick={onStartAnalysis}
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
              onClick={onReset}
              variant="outline"
              disabled={isAnalyzing || isUploading}
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

