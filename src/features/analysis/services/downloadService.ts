import axios from "axios";
import { trackResumeDownload, trackConversion } from '@/utils/analytics';

/**
 * Service for downloading resume files
 */
export class DownloadService {
  /**
   * Download file from URL
   */
  static async downloadFile(url: string, filename: string): Promise<void> {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Download optimized resume (direct URL download)
   * Uses local storage URLs (no Cloudinary)
   */
  static downloadResume(
    url: string,
    filename: string = "optimized-resume.pdf", // kept for backward compatibility (no longer used)
    resumeId?: string
  ): void {
    if (!url) {
      throw new Error("Download URL is required");
    }

    // Track download event
    if (resumeId) {
      trackResumeDownload("optimized", resumeId);
      trackConversion("download");
    }

    // Open the Tigris URL in a new tab so the user
    // can view the PDF there and choose to download it.
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
