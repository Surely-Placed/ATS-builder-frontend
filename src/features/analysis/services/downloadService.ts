import axios from "axios";
import { trackResumeDownload, trackConversion } from '@/utils/analytics';
import { analysisApiClient } from "./apiClient";
import { API_BASE_URL } from "@/config/api";

/** True when the URL is on a different origin than our API (e.g. pre-signed Tigris/S3). Sending credentials to such URLs triggers CORS when the server responds with Access-Control-Allow-Origin: *. */
function isExternalUrl(url: string): boolean {
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;
  try {
    const apiHost = new URL(API_BASE_URL).host;
    const urlHost = new URL(url).host;
    return urlHost !== apiHost;
  } catch {
    return true;
  }
}

/**
 * Service for downloading resume files
 */
export class DownloadService {
  /**
   * Download file from URL as PDF (fetches as blob, forces application/pdf and filename so it never saves as .xml).
   * For external URLs (e.g. Tigris pre-signed) uses no credentials to avoid CORS issues.
   * @param resumeId - optional; if provided, tracks download for analytics
   */
  static async downloadFile(url: string, filename: string, resumeId?: string): Promise<void> {
    try {
      const external = isExternalUrl(url);
      const client = external ? axios : analysisApiClient;
      const response = await client.get(url, {
        responseType: "blob",
        withCredentials: !external,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename.endsWith(".pdf") ? filename : `${filename.replace(/\.\w+$/, "")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      if (resumeId) {
        trackResumeDownload("optimized", resumeId);
        trackConversion("download");
      }
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
