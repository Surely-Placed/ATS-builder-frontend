import { useCallback } from "react";
import { DownloadService } from '@/features/analysis/services';
import { OptimizationResult } from '@/features/analysis/services/types';
import { getResumeUrl } from '@/utils/resumeUrlHelper';

export interface UseResumeDownloadOptions {
  analysisId: string;
  optimizedResumeUrl: string | null;
  result: OptimizationResult | null;
}

export interface UseResumeDownloadReturn {
  downloadResume: () => void;
}

/**
 * Hook for handling resume download logic
 */
export function useResumeDownload({
  analysisId,
  optimizedResumeUrl,
  result,
}: UseResumeDownloadOptions): UseResumeDownloadReturn {
  const downloadResume = useCallback(() => {
    try {
      // Try to get URL from multiple possible locations
      let optimizedUrl: string | null | undefined = null;

      // Priority 1: Check result.optimized_resume
      if (result?.optimized_resume) {
        optimizedUrl =
          result.optimized_resume.file_url ||
          result.optimized_resume.url ||
          result.optimized_resume.pdf_url ||
          null;
      }

      // Priority 2: Check result.analysis.optimized_file_url
      if (
        !optimizedUrl &&
        typeof result?.analysis?.optimized_file_url === "string"
      ) {
        optimizedUrl = result.analysis.optimized_file_url;
      }

      // Priority 3: Use state optimizedResumeUrl
      if (!optimizedUrl && optimizedResumeUrl) {
        optimizedUrl = optimizedResumeUrl;
      }

      if (!optimizedUrl) {
        throw new Error("No optimized resume URL available. The resume may not be optimized yet.");
      }

      const resumeData = {
        id: analysisId,
        optimized_file_url: optimizedUrl,
        original_file_url: null,
      };

      // Get the proper URL using the helper (handles local storage URLs)
      const url = getResumeUrl(resumeData, {
        preferOptimized: true,
        useProxy: false,
      });

      if (!url) {
        throw new Error("No download URL available. Optimized resume may not be ready yet.");
      }

      DownloadService.downloadResume(url, "optimized-resume.pdf", analysisId);
    } catch (error: any) {
      throw error;
    }
  }, [optimizedResumeUrl, result, analysisId]);

  return {
    downloadResume,
  };
}
