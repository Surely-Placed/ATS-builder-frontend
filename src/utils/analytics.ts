import { logEvent, Analytics } from 'firebase/analytics';
import { analytics } from '../config/firebase';
import { trackEvent as trackMixpanelEvent } from '../config/mixpanel';

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
      console.warn('Firebase Analytics event failed:', error);
    }
  }
  
  // Send to Mixpanel
  try {
    trackMixpanelEvent(eventName, eventParams);
  } catch (error) {
    console.warn('Mixpanel event failed:', error);
  }
};

// Authentication Events
export const trackLogin = (method: 'email' | 'google') => {
  safeLogEvent('login', { method });
};

export const trackSignup = (method: 'email' | 'google') => {
  safeLogEvent('sign_up', { method });
};

export const trackLogout = () => {
  safeLogEvent('logout');
};

// Resume Events
export const trackResumeUpload = (fileSize: number, fileName: string) => {
  safeLogEvent('resume_upload', {
    file_size: fileSize,
    file_name: fileName,
  });
};

export const trackResumeDelete = (resumeId: string) => {
  safeLogEvent('resume_delete', {
    resume_id: resumeId,
  });
};

// Analysis Events
export const trackAnalysisStart = (resumeId: string, jobTitle?: string) => {
  safeLogEvent('analysis_start', {
    resume_id: resumeId,
    job_title: jobTitle || 'unknown',
  });
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
  safeLogEvent('analysis_complete', {
    resume_id: resumeId,
    ats_score: atsScore,
    job_title: jobTitle || 'unknown',
    // Token usage tracking
    ...(tokenUsage && {
      openai_prompt_tokens: tokenUsage.prompt_tokens,
      openai_completion_tokens: tokenUsage.completion_tokens,
      openai_total_tokens: tokenUsage.total_tokens,
      openai_model: tokenUsage.model || 'unknown',
    }),
  });
};

// Optimization Events
export const trackOptimizationStart = (analysisId: string) => {
  safeLogEvent('optimization_start', {
    analysis_id: analysisId,
  });
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
  safeLogEvent('optimization_complete', {
    analysis_id: analysisId,
    score_improvement: scoreImprovement,
    ats_score_before: atsScoreBefore,
    ats_score_after: atsScoreAfter,
    // Token usage tracking
    ...(tokenUsage && {
      openai_prompt_tokens: tokenUsage.prompt_tokens,
      openai_completion_tokens: tokenUsage.completion_tokens,
      openai_total_tokens: tokenUsage.total_tokens,
      openai_model: tokenUsage.model || 'unknown',
    }),
  });
};

export const trackOptimizationFailed = (analysisId: string, error?: string) => {
  safeLogEvent('optimization_failed', {
    analysis_id: analysisId,
    error: error || 'unknown',
  });
};

// Download Events
export const trackResumeDownload = (
  type: 'original' | 'optimized',
  resumeId: string
) => {
  safeLogEvent('resume_download', {
    download_type: type,
    resume_id: resumeId,
  });
};

export const trackPDFGenerate = (analysisId: string) => {
  safeLogEvent('pdf_generate', {
    analysis_id: analysisId,
  });
};

// Navigation Events
export const trackPageView = (pageName: string, pagePath: string) => {
  safeLogEvent('page_view', {
    page_name: pageName,
    page_path: pagePath,
  });
};

// User Engagement Events
export const trackButtonClick = (buttonName: string, location?: string) => {
  safeLogEvent('button_click', {
    button_name: buttonName,
    location: location || 'unknown',
  });
};

export const trackFeatureUse = (featureName: string, details?: Record<string, any>) => {
  safeLogEvent('feature_use', {
    feature_name: featureName,
    ...details,
  });
};

// Error Events
export const trackError = (errorType: string, errorMessage: string, location?: string) => {
  safeLogEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    location: location || 'unknown',
  });
};

// Conversion Events (for measuring key business metrics)
export const trackConversion = (
  conversionType: 'resume_upload' | 'analysis' | 'optimization' | 'download',
  value?: number
) => {
  safeLogEvent('conversion', {
    conversion_type: conversionType,
    value: value || 0,
  });
};


