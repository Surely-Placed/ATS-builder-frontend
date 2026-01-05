import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ResumePreviewWithChanges from '@/components/resume/ResumePreviewWithChanges';
import AnalysisApiService from '@/services/analysisApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
      setError('Analysis ID is required');
      setIsLoading(false);
      return;
    }

    const loadPreview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const previewResponse = await AnalysisApiService.getPreview(analysisId);
        setPreviewData({
          originalResume: previewResponse.original_resume.structured_data,
          optimizedResume: previewResponse.optimized_resume.structured_data,
          changes: previewResponse.changes,
        });
      } catch (err: any) {
        const errorMessage = err.message || 'Could not load resume preview';
        setError(errorMessage);
        toast({
          title: 'Failed to load preview',
          description: errorMessage,
          variant: 'destructive',
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
      const pdfResponse = await AnalysisApiService.generatePDF(analysisId);
      if (pdfResponse.file_url) {
        AnalysisApiService.downloadResume(
          pdfResponse.file_url,
          'optimized-resume.pdf',
          undefined
        );
        toast({
          title: 'PDF Generated & Downloaded',
          description: 'Your optimized resume PDF has been generated and downloaded successfully',
        });
      }
      // Navigate back to comparison or optimization page
      navigate(`/resume-optimization?analysisId=${analysisId}`);
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
    // Navigate back to optimization page
    if (analysisId) {
      navigate(`/resume-optimization?analysisId=${analysisId}`);
    } else {
      navigate('/resume-optimization');
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
            <p className="text-destructive">{error || 'Preview not available'}</p>
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

