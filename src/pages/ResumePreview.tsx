import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ResumePreviewWithChanges from "@/features/resume/components/ResumePreviewWithChanges";
import AnalysisApiService from '@/features/analysis/services';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { reconstructOptimizedResume } from "@/utils/resume/reconstructOptimized";

export default function ResumePreview() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewData, setPreviewData] = useState<{
    originalResume: any;
    optimizedResume: any;
    changes: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analysisId) {
      setError("Analysis ID is required");
      setIsLoading(false);
      return;
    }

    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const previewResponse = await AnalysisApiService.getPreview(analysisId);
        
        // Validate that we have the required data
        if (!previewResponse.original_resume?.structured_data) {
          throw new Error('Original resume structured data is missing');
        }
        
        let optimizedResumeData = previewResponse.optimized_resume?.structured_data;
        
        // Check if optimized_resume.structured_data is actually structured data or just file URLs
        // Backend bug: sometimes it returns {url, pdf_url, file_url} instead of the actual resume structure
        if (optimizedResumeData && !optimizedResumeData.personal_info) {
          // Reconstruct the optimized resume by applying changes to the original
          optimizedResumeData = reconstructOptimizedResume(
            previewResponse.original_resume.structured_data,
            previewResponse.changes
          );
        }
        
        if (!optimizedResumeData) {
          throw new Error('Optimized resume structured data is missing. The optimization may not have completed successfully.');
        }
        
        setPreviewData({
          originalResume: previewResponse.original_resume.structured_data,
          optimizedResume: optimizedResumeData,
          changes: previewResponse.changes,
        });
      } catch (err: any) {
        const errorMessage = err.message || "Could not load resume preview";
        setError(errorMessage);
        toast({
          title: "Failed to load preview",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [analysisId, toast]);

  const handlePreviewConfirm = async () => {
    if (!analysisId) return;

    setIsGeneratingPDF(true);
    try {
      // Fetch the analysis data to get the optimized resume URL
      const analysis = await AnalysisApiService.getAnalysis(analysisId);
      // logic from RecentActivityCard.tsx
      let pdfUrl = 
        analysis?.optimized_resume?.file_url || 
        analysis?.optimized_resume?.url || 
        analysis?.optimized_resume?.pdf_url || 
        analysis?.analysis?.optimized_file_url ||
        null;

      // If still no URL, try generation (fallback)
      if (!pdfUrl) {
         try {
            const genResponse = await AnalysisApiService.generatePDF(analysisId);
            if (genResponse.success && genResponse.file_url) {
                pdfUrl = genResponse.file_url;
            }
         } catch (genErr) {
             console.error("Failed to generate PDF on demand:", genErr);
         }
      }

      if (pdfUrl) {
        // Use the service to download
        AnalysisApiService.downloadResume(pdfUrl, 'optimized-resume.pdf', analysisId);
        
        toast({
          title: "Download Started",
          description: "Your optimized resume has been downloaded successfully",
        });
      } else {
        throw new Error("Download URL not available");
      }
      
      // Navigate back to comparison page
      setTimeout(() => {
        navigate(`/resume-comparison?analysisId=${analysisId}`);
      }, 1000);
    } catch (err: any) {
      console.error("Download failed:", err);
      toast({
        title: "Failed to download PDF",
        description: err.message || "Could not download PDF",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePreviewCancel = () => {
    // Navigate back to optimization page
    if (analysisId) {
      navigate('/resume-analysis', { replace: true });
    } else {
      navigate("/resume-analysis");
    }

  };

  if (isLoading) {
    return (
      <DashboardLayout activeTab="Resume Optimization">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !previewData) {
    return (
      <DashboardLayout activeTab="Resume Optimization">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4 max-w-md text-center">
            <p className="text-destructive">{error || "Preview not available"}</p>
            <button
              onClick={handlePreviewCancel}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="Resume Optimization">
      <ResumePreviewWithChanges
        originalResume={previewData.originalResume}
        optimizedResume={previewData.optimizedResume}
        changes={previewData.changes}
        onConfirm={handlePreviewConfirm}
        onCancel={handlePreviewCancel}
        isGenerating={isGeneratingPDF}
      />
    </DashboardLayout>
  );
}
