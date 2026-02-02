import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, X } from "lucide-react";

interface FileUploadProps {
  uploadedFile: File | null;
  isUploading: boolean;
  isAnalyzing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
}

export const FileUpload = ({
  uploadedFile,
  isUploading,
  isAnalyzing,
  fileInputRef,
  onFileSelect,
  onRemoveFile,
}: FileUploadProps) => {
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
          accept=".pdf,application/pdf"
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
            <p className="text-xs text-muted-foreground">
              or click to browse (PDF only - Max 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
