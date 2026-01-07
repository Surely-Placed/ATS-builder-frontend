import { logEvent, Analytics } from "firebase/analytics";
import { analytics } from "../config/firebase";
import { trackEvent as trackMixpanelEvent } from "../config/mixpanel";

/**
 * Analytics utility for tracking custom events
 * All events are automatically sent to Firebase Analytics (Google Analytics 4) and Mixpanel
 */

// Helper to safely log events (handles null analytics)
const safeLogEvent = (eventName: string, eventParams?: Record<string, any>) => {
  // Send to Firebase Analytics
  if (analytics) {
    try {
      logEvent(analytics, eventName, eventParams);
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }

  // Send to Mixpanel
  try {
    trackMixpanelEvent(eventName, eventParams);
  } catch (error) {
    console.warn("Mixpanel event failed:", error);
  }
};

// Authentication Events - Only track counts for Mixpanel
export const trackLogin = (method: "email" | "google") => {
  // Firebase Analytics
  if (analytics) {
    try {
      logEvent(analytics, "login", { method });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }

  // Mixpanel - Only track count
  try {
    trackMixpanelEvent("Sign In Count");
  } catch (error) {
    console.warn("Mixpanel event failed:", error);
  }
};

export const trackSignup = (method: "email" | "google") => {
  // Firebase Analytics
  if (analytics) {
    try {
      logEvent(analytics, "sign_up", { method });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }

  // Mixpanel - Only track count
  try {
    trackMixpanelEvent("Sign Up Count");
  } catch (error) {
    console.warn("Mixpanel event failed:", error);
  }
};

export const trackLogout = () => {
  // Only Firebase Analytics - no Mixpanel tracking
  if (analytics) {
    try {
      logEvent(analytics, "logout");
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};

// Resume Events - Only Firebase Analytics, not Mixpanel
export const trackResumeUpload = (fileSize: number, fileName: string) => {
  if (analytics) {
    try {
      logEvent(analytics, "resume_upload", {
        file_size: fileSize,
        file_name: fileName,
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};

export const trackResumeDelete = (resumeId: string) => {
  if (analytics) {
    try {
      logEvent(analytics, "resume_delete", {
        resume_id: resumeId,
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};

// Analysis Events - Only Firebase Analytics, not Mixpanel
export const trackAnalysisStart = (resumeId: string, jobTitle?: string) => {
  if (analytics) {
    try {
      logEvent(analytics, "analysis_start", {
        resume_id: resumeId,
        job_title: jobTitle || "unknown",
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};

export const trackAnalysisComplete = (
  resumeId: string,
  atsScore: number,
  jobTitle?: string,
  tokenUsage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    model?: string;
  }
) => {
  // Firebase Analytics - full details
  if (analytics) {
    try {
      logEvent(analytics, "analysis_complete", {
        resume_id: resumeId,
        ats_score: atsScore,
        job_title: jobTitle || "unknown",
        ...(tokenUsage && {
          openai_prompt_tokens: tokenUsage.prompt_tokens,
          openai_completion_tokens: tokenUsage.completion_tokens,
          openai_total_tokens: tokenUsage.total_tokens,
          openai_model: tokenUsage.model || "unknown",
        }),
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }

  // Mixpanel - Only track count
  try {
    trackMixpanelEvent("ATS Run Count");
  } catch (error) {
    console.warn("Mixpanel event failed:", error);
  }
};

// Optimization Events - Only Firebase Analytics, not Mixpanel
export const trackOptimizationStart = (analysisId: string) => {
  if (analytics) {
    try {
      logEvent(analytics, "optimization_start", {
        analysis_id: analysisId,
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};

export const trackOptimizationComplete = (
  analysisId: string,
  scoreImprovement: number,
  atsScoreBefore: number,
  atsScoreAfter: number,
  tokenUsage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    model?: string;
  }
) => {
  // Firebase Analytics - full details
  if (analytics) {
    try {
      logEvent(analytics, "optimization_complete", {
        analysis_id: analysisId,
        score_improvement: scoreImprovement,
        ats_score_before: atsScoreBefore,
        ats_score_after: atsScoreAfter,
        ...(tokenUsage && {
          openai_prompt_tokens: tokenUsage.prompt_tokens,
          openai_completion_tokens: tokenUsage.completion_tokens,
          openai_total_tokens: tokenUsage.total_tokens,
          openai_model: tokenUsage.model || "unknown",
        }),
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }

  // Mixpanel - Only track count
  try {
    trackMixpanelEvent("ATS Optimize Count");
  } catch (error) {
    console.warn("Mixpanel event failed:", error);
  }
};

export const trackOptimizationFailed = (analysisId: string, error?: string) => {
  if (analytics) {
    try {
      logEvent(analytics, "optimization_failed", {
        analysis_id: analysisId,
        error: error || "unknown",
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};

// Download Events
export const trackResumeDownload = (type: "original" | "optimized", resumeId: string) => {
  // Firebase Analytics - full details
  if (analytics) {
    try {
      logEvent(analytics, "resume_download", {
        download_type: type,
        resume_id: resumeId,
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }

  // Mixpanel - Only track count
  try {
    trackMixpanelEvent("Resume Download Count");
  } catch (error) {
    console.warn("Mixpanel event failed:", error);
  }
};

export const trackPDFGenerate = (analysisId: string) => {
  if (analytics) {
    try {
      logEvent(analytics, "pdf_generate", {
        analysis_id: analysisId,
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};

// Conversion Events - Only Firebase Analytics, not Mixpanel
export const trackConversion = (
  conversionType: "resume_upload" | "analysis" | "optimization" | "download",
  value?: number
) => {
  if (analytics) {
    try {
      logEvent(analytics, "conversion", {
        conversion_type: conversionType,
        value: value || 0,
      });
    } catch (error) {
      console.warn("Firebase Analytics event failed:", error);
    }
  }
};
