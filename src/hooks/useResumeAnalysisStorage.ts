import { useState, useEffect } from 'react';
import { AnalysisResult } from '../services/analysisApi';

export type ViewState = 'form' | 'analysis' | 'optimizing' | 'comparison' | 'preview';

interface StoredData {
  analysisResult: AnalysisResult;
  viewState: ViewState;
  analysisId: string | null;
  resumeId: string | null;
  jobTitle: string;
  jobDescription: string;
  optimizationResult: any;
  optimizedResumeUrl: string | null;
}

const STORAGE_KEYS = {
  ANALYSIS_RESULT: 'resume_analysis_result',
  VIEW_STATE: 'resume_analysis_view_state',
  ANALYSIS_ID: 'resume_analysis_id',
  RESUME_ID: 'resume_analysis_resume_id',
  JOB_TITLE: 'resume_analysis_job_title',
  JOB_DESCRIPTION: 'resume_analysis_job_description',
  OPTIMIZATION_RESULT: 'resume_optimization_result',
  OPTIMIZED_RESUME_URL: 'resume_optimized_url',
};

export const useResumeAnalysisStorage = () => {
  const loadFromStorage = (): Partial<StoredData> | null => {
    try {
      const storedResult = localStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULT);
      const storedViewState = localStorage.getItem(STORAGE_KEYS.VIEW_STATE) as ViewState | null;
      const storedAnalysisId = localStorage.getItem(STORAGE_KEYS.ANALYSIS_ID);
      const storedResumeId = localStorage.getItem(STORAGE_KEYS.RESUME_ID);
      const storedJobTitle = localStorage.getItem(STORAGE_KEYS.JOB_TITLE);
      const storedJobDescription = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTION);
      const storedOptimizationResult = localStorage.getItem(STORAGE_KEYS.OPTIMIZATION_RESULT);
      const storedOptimizedUrl = localStorage.getItem(STORAGE_KEYS.OPTIMIZED_RESUME_URL);

      if (storedResult && storedViewState) {
        return {
          analysisResult: JSON.parse(storedResult) as AnalysisResult,
          viewState: storedViewState,
          analysisId: storedAnalysisId,
          resumeId: storedResumeId,
          jobTitle: storedJobTitle || '',
          jobDescription: storedJobDescription || '',
          optimizationResult: storedOptimizationResult ? JSON.parse(storedOptimizationResult) : null,
          optimizedResumeUrl: storedOptimizedUrl,
        };
      }
    } catch (error) {
      // Failed to load from local storage
    }
    return null;
  };

  const saveToStorage = (
    result: AnalysisResult | null,
    viewState: ViewState,
    analysisId: string | null,
    resumeId: string | null,
    jobTitle: string,
    jobDescription: string,
    optimizationResult?: any,
    optimizedResumeUrl?: string | null
  ) => {
    try {
      if (result) {
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULT, JSON.stringify(result));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULT);
      }
      localStorage.setItem(STORAGE_KEYS.VIEW_STATE, viewState);
      if (analysisId) {
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_ID, analysisId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ANALYSIS_ID);
      }
      if (resumeId) {
        localStorage.setItem(STORAGE_KEYS.RESUME_ID, resumeId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.RESUME_ID);
      }
      if (jobTitle) {
        localStorage.setItem(STORAGE_KEYS.JOB_TITLE, jobTitle);
      } else {
        localStorage.removeItem(STORAGE_KEYS.JOB_TITLE);
      }
      if (jobDescription) {
        localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTION, jobDescription);
      } else {
        localStorage.removeItem(STORAGE_KEYS.JOB_DESCRIPTION);
      }
      if (optimizationResult) {
        localStorage.setItem(STORAGE_KEYS.OPTIMIZATION_RESULT, JSON.stringify(optimizationResult));
      }
      if (optimizedResumeUrl) {
        localStorage.setItem(STORAGE_KEYS.OPTIMIZED_RESUME_URL, optimizedResumeUrl);
      }
    } catch (error) {
      // Failed to save to local storage
    }
  };

  const clearStorage = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      // Failed to clear local storage
    }
  };

  return { loadFromStorage, saveToStorage, clearStorage };
};

