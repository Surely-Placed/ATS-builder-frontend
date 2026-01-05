import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import AnalysisApiService from '@/services/analysisApi';

interface UseDownloadHandlerProps {
  optimizedResumeUrl: string | null;
  optimizationResult: any;
  analysisId: string | null;
  downloadResume: () => void;
}

export function useDownloadHandler({
  optimizedResumeUrl,
  optimizationResult,
  analysisId,
  downloadResume,
}: UseDownloadHandlerProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);

      // Try to get URL from multiple sources (parent state takes priority)
      let downloadUrl: string | null = null;

      // Priority 1: Use optimizedResumeUrl from parent state
      if (optimizedResumeUrl) {
        downloadUrl = optimizedResumeUrl;
      }
      // Priority 2: Check optimizationResult
      else if (optimizationResult?.optimized_resume?.file_url) {
        downloadUrl = optimizationResult.optimized_resume.file_url;
      } else if (optimizationResult?.optimized_resume?.url) {
        downloadUrl = optimizationResult.optimized_resume.url;
      } else if (optimizationResult?.optimized_resume?.pdf_url) {
        downloadUrl = optimizationResult.optimized_resume.pdf_url;
      } else if (optimizationResult?.analysis?.optimized_file_url) {
        downloadUrl = optimizationResult.analysis.optimized_file_url;
      }
      // Priority 3: Try hook's downloadResume (fallback)
      else {
        downloadResume();
        toast({
          title: 'Download started',
          description: 'Your optimized resume is downloading',
        });
        setTimeout(() => {
          setIsDownloading(false);
        }, 2000);
        return;
      }

      if (!downloadUrl) {
        throw new Error('No optimized resume URL available. The resume may not be optimized yet.');
      }

      AnalysisApiService.downloadResume(downloadUrl, 'optimized-resume.pdf', analysisId || undefined);

      toast({
        title: 'Download started',
        description: 'Your optimized resume is downloading',
      });

      // Reset loading state after a short delay (download happens in browser)
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (err: any) {
      setIsDownloading(false);
      toast({
        title: 'Download failed',
        description: err.message || 'Failed to download resume',
        variant: 'destructive',
      });
    }
  }, [optimizedResumeUrl, optimizationResult, analysisId, downloadResume, toast]);

  return {
    isDownloading,
    handleDownload,
  };
}

