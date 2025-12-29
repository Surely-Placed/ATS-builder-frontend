import axios from 'axios';
import { 
  trackAnalysisStart, 
  trackAnalysisComplete, 
  trackOptimizationStart, 
  trackOptimizationComplete, 
  trackOptimizationFailed,
  trackResumeDownload,
  trackPDFGenerate,
  trackConversion
} from '../utils/analytics';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface StartAnalysisRequest {
  resume_id: string;
  job_description: string;
  job_title: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult;
}

export interface OptimizationJobResponse {
  success: boolean;
  jobId: string;
  analysisId: string;
}

export interface JobStatusResponse {
  success: boolean;
  status: 'pending' | 'running' | 'complete' | 'failed';
  progress: number;
  result: OptimizationResult | null;
  error: string | null;
}

export interface ResumeQualityScore {
  score: number;
  level: 'Strong' | 'Average' | 'Needs Improvement';
  issues: string[];
  strengths: string[];
}

export interface ComprehensiveFeedback {
  overall_score: number;
  ats_score: number;
  quality_score: number | null;
  level: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  feedback: {
    ats_feedback: string;
    quality_feedback: string;
    combined_recommendations: string[];
  };
}

export interface AnalysisResult {
  analysis: {
    id: string;
    resume_id: string;
    job_id: string;
    ats_score_before: number;
    ats_score_after: number | null;
    created_at: string;
  };
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    extracted_data: any;
  };
  original_resume: {
    file_url: string;
    structured_data: any;
  };
  ats_analysis: {
    before: {
      score: number;
      label: string;
      breakdown: {
        keyword_match: number;
        experience_relevance: number;
        education_match: number;
        structure_quality: number;
      };
      matched_skills: string[];
      missing_skills: string[];
    };
    ai_insights: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  };
  section_analysis: null; // ⚠️ Always null - removed for performance
  resume_quality?: ResumeQualityScore | null;
  comprehensive_feedback?: ComprehensiveFeedback | null;
  optimized_resume: null;
  note: string;
}

export interface OptimizationResult {
  analysis: {
    id: string;
    resume_id: string;
    job_id: string;
    ats_score_before: number;
    ats_score_after: number;
    score_improvement: number;
    created_at: string;
  };
  original_resume: {
    file_url: string;
    structured_data: any;
  };
  optimized_resume: {
    file_url: string;
    structured_data: any;
  };
  ats_analysis: {
    before: {
      score: number;
      breakdown: any;
      matched_skills: string[];
      missing_skills: string[];
    };
    after: {
      score: number;
      improvement: number;
    };
    ai_insights: any;
  };
  keyword_alignment: any;
  final_audit: {
    integrity_verified: boolean;
    quality_score: number;
    new_ats_score: number;
    score_improvement: number;
    improvements_made: string[];
    remaining_gaps: string[];
    final_recommendations: string[];
    ready_for_submission: boolean;
  };
}

export interface ChangeHighlight {
  section: string;
  field: string;
  original: string | string[] | null;
  optimized: string | string[] | null;
  changeType: 'added' | 'removed' | 'modified' | 'reordered';
  location?: { index?: number; line?: number };
}

export interface SectionChanges {
  section: string;
  hasChanges: boolean;
  changes: ChangeHighlight[];
}

export interface ResumeDiffResult {
  hasChanges: boolean;
  totalChanges: number;
  sections: SectionChanges[];
  summary: {
    sectionsModified: number;
    sectionsUnchanged: number;
  };
}

export interface PreviewResponse {
  success: boolean;
  data: {
    original_resume: {
      structured_data: any;
    };
    optimized_resume: {
      structured_data: any;
    };
    changes: ResumeDiffResult;
  };
}

// Section Analysis types kept for reference (used in optimization results potentially)
// Note: section_analysis is always null in quick analysis response
export interface SectionAnalysisResult {
  sections: {
    personal_info: SectionAnalysis;
    summary: SectionAnalysis;
    skills: SkillsSectionAnalysis;
    work_experience: WorkExperienceSectionAnalysis;
    education: SectionAnalysis;
    projects: SectionAnalysis;
    certifications: SectionAnalysis;
  };
  overall_quality_score: number;
  priority_actions: PriorityAction[];
}

export interface SectionAnalysis {
  status: 'good' | 'needs_improvement' | 'poor';
  issues: SectionIssue[];
  score: number;
  summary: string;
}

export interface SkillsSectionAnalysis extends SectionAnalysis {
  keyword_alignment?: {
    matched_skills: string[];
    missing_skills: string[];
    suggested_additions: string[];
  };
}

export interface WorkExperienceSectionAnalysis {
  status: 'good' | 'needs_improvement' | 'poor';
  overall_score: number;
  summary: string;
  jobs: WorkExperienceJobAnalysis[];
}

export interface WorkExperienceJobAnalysis {
  company: string;
  title: string;
  status: 'good' | 'needs_improvement' | 'poor';
  score: number;
  issues: SectionIssue[];
}

export interface SectionIssue {
  type: 'error' | 'warning' | 'suggestion' | 'missing' | 'ats_optimization';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  current?: string;
  suggestion: string;
  example?: string;
}

export interface PriorityAction {
  section: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export class AnalysisApiService {
  /**
   * Quick Analysis (synchronous)
   * POST /api/analyze
   */
  static async analyzeResume(data: StartAnalysisRequest): Promise<AnalysisResult> {
    try {
      // Track analysis start
      trackAnalysisStart(data.resume_id, data.job_title);
      
      const response = await api.post<AnalysisResponse>('/analyze', data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to analyze resume');
      }
      
      const result = response.data.data;
      
      // Track analysis complete
      const atsScore = result.ats_analysis?.before?.score || 0;
      trackAnalysisComplete(data.resume_id, atsScore, data.job_title);
      trackConversion('analysis');
      
      return result;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to analyze resume');
    }
  }

  /**
   * Start Optimization (async)
   * POST /api/analyze/:analysisId/optimize
   */
  static async startOptimization(analysisId: string): Promise<OptimizationJobResponse> {
    try {
      // Track optimization start
      trackOptimizationStart(analysisId);
      
      const response = await api.post<OptimizationJobResponse>(`/analyze/${analysisId}/optimize`);
      
      if (!response.data.success || !response.data.jobId) {
        throw new Error('Failed to start optimization');
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to start optimization');
    }
  }

  /**
   * Get Optimization Job Status
   * GET /api/analyze/job/:jobId/status
   */
  static async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    try {
      const response = await api.get<JobStatusResponse>(`/analyze/job/${jobId}/status`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get job status');
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get job status');
    }
  }

  /**
   * Get Analysis Details (includes optimized resume URL)
   * GET /api/analyze/:analysisId
   */
  static async getAnalysis(analysisId: string): Promise<any> {
    try {
      const response = await api.get(`/analyze/${analysisId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get analysis');
    }
  }

  /**
   * Download file from URL
   */
  static async downloadFile(url: string, filename: string): Promise<void> {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
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
  static downloadResume(url: string, filename: string = 'optimized-resume.pdf', resumeId?: string): void {
    // Track download event
    if (resumeId) {
      trackResumeDownload('optimized', resumeId);
      trackConversion('download');
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Get Resume Preview with Changes
   * GET /api/analyze/:analysisId/preview
   */
  static async getPreview(analysisId: string): Promise<PreviewResponse['data']> {
    try {
      const response = await api.get<PreviewResponse>(`/analyze/${analysisId}/preview`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to get preview');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get preview');
    }
  }

  /**
   * Generate PDF from optimized resume
   * POST /api/analyze/:analysisId/generate-pdf
   */
  static async generatePDF(analysisId: string): Promise<{ success: boolean; file_url: string }> {
    try {
      const response = await api.post<{ success: boolean; file_url: string }>(`/analyze/${analysisId}/generate-pdf`);
      
      if (!response.data.success) {
        throw new Error('Failed to generate PDF');
      }
      
      // Track PDF generation
      trackPDFGenerate(analysisId);
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to generate PDF');
    }
  }
}

export default AnalysisApiService;
