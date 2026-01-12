import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getFileErrorMessage } from "@/utils/fileValidation";
import { resumeApi } from "@/services/resumeApi";
import { useResumeAnalysisStorage } from "@/hooks/useResumeAnalysisStorage";

export function useFileUpload() {
  const { toast } = useToast();
  const { loadFromStorage } = useResumeAnalysisStorage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore resumeId from storage on mount
  useEffect(() => {
    const storedData = loadFromStorage();
    if (storedData?.resumeId && !resumeId) {
      setResumeId(storedData.resumeId);
      // Note: We can't restore the File object, but resumeId is enough to continue
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    const errorMsg = getFileErrorMessage(file);
    if (errorMsg) {
      toast({
        title: "Invalid file",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadedResumeId = await resumeApi.uploadResume(file);
      setResumeId(uploadedResumeId);
      setUploadedFile(file);
      toast({
        title: "File uploaded",
        description: `${file.name} uploaded successfully`,
      });
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setResumeId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    uploadedFile,
    resumeId,
    isUploading,
    fileInputRef,
    handleFileSelect,
    handleRemoveFile,
    setResumeId,
    setUploadedFile,
  };
}
