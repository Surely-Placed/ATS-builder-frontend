// utils/resumeUrlHelper.ts - Helper for handling resume file URLs

/**
 * Get the resume PDF URL for display/download
 * Handles local storage URLs from backend
 */
export const getResumeUrl = (
  resume: {
    original_file_url?: string | null;
    optimized_file_url?: string | null;
    id?: string;
  },
  options?: {
    useProxy?: boolean; // (legacy) Prefer authenticated proxy endpoint when no direct URL is available
    preferOptimized?: boolean; // Use optimized_file_url if available
    baseUrl?: string; // Backend base URL (defaults to current origin or localhost:5000)
  }
): string => {
  const {
    useProxy = false,
    preferOptimized = true,
    baseUrl = typeof window !== "undefined"
      ? import.meta.env.VITE_API_URL?.replace("/api", "") ||
        window.location.origin
          .replace(":3000", ":5000")
          .replace(":5173", ":5000")
          .replace(":8080", ":5000") // Frontend port to backend port
      : import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev",
  } = options || {};

  // Get the appropriate URL (optimized or original)
  const fileUrl =
    preferOptimized && resume.optimized_file_url
      ? resume.optimized_file_url
      : resume.original_file_url || null;

  // If no file URL and we have an ID, use proxy endpoint as fallback
  if (!fileUrl) {
    if (resume.id) {
      // When no direct file URL is available, optionally fall back to the
      // authenticated proxy endpoint. This is used mainly for local/dev.
      if (useProxy) {
        return `${baseUrl}/api/resume/${resume.id}/pdf`;
      }
    }
    // If no ID either, return empty string instead of throwing
    return "";
  }

  // If it's already a full URL (local storage), return as-is
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }

  // If it's a relative path, construct full URL
  if (fileUrl.startsWith("/api/files/") || fileUrl.startsWith("resumes/")) {
    const path = fileUrl.startsWith("/") ? fileUrl : `/api/files/${fileUrl}`;
    return `${baseUrl}${path}`;
  }

  return fileUrl;
};

/**
 * Check if URL is a local storage URL
 */
export const isLocalStorageUrl = (url: string): boolean => {
  return (
    url.includes("/api/files/resumes/") ||
    url.includes("localhost:5000/api/files/") ||
    url.includes("ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api/files/")
  );
};

/**
 * Check if URL is a legacy Cloudinary URL (for migration compatibility)
 * @deprecated Cloudinary is no longer used, kept for backward compatibility only
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes("cloudinary.com") || url.includes("res.cloudinary.com");
};

/**
 * Get PDF viewer URL (for embedding in iframe or object)
 */
export const getPdfViewerUrl = (
  resume: {
    original_file_url?: string | null;
    optimized_file_url?: string | null;
    id?: string;
  },
  options?: {
    useProxy?: boolean;
    preferOptimized?: boolean;
    baseUrl?: string;
  }
): string => {
  // Get the URL - local storage URLs work directly in browser PDF viewer
  return getResumeUrl(resume, options);
};
