// Analysis API Types
export interface StartAnalysisRequest {
  resume_id: string;
  job_description: string;
  job_title: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult;
  token_usage?: TokenUsage;
}

export interface OptimizationJobResponse {
  message: any;
  success: boolean;
  jobId: string;
  analysisId: string;
}

export interface JobStatusResponse {
  success: boolean;
  status: "optimization_pending" | "optimization_processing" | "optimization_completed" | "optimization_failed";
  progress: number;
  result: OptimizationResult | null;
  error: string | null;
  token_usage?: TokenUsage;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  model?: string;
}

export interface ResumeQualityScore {
  score: number;
  level: "Strong" | "Average" | "Needs Improvement";
  issues: string[];
  strengths: string[];
}

export interface ComprehensiveFeedback {
  overall_score: number;
  ats_score: number;
  quality_score: number | null;
  level: "Excellent" | "Good" | "Average" | "Needs Improvement";
  feedback: {
    ats_feedback: string;
    quality_feedback: string;
    combined_recommendations: string[];
  };
}

export interface AnalysisResult {
  // Allow backends to include additional fields without breaking typing.
  // (Previously this was `[x: string]: AnalysisResult`, which was incorrect and caused type errors.)
  [key: string]: unknown;
  analysis: {
    id: string;
    resume_id: string;
    ats_score_before: number;
    ats_score_after: number | null;
    /**
     * Optional quality score returned by some backends (used as a simpler UI metric).
     */
    quality_score?: number | null;
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
      display_score: number;
      score: number;
      real_score?: number;
      label: string;
      breakdown: {
        keyword_match: number;
        experience_relevance: number;
        education_match: number;
        structure_quality: number;
      } | null;
      matched_skills: string[];
      missing_skills: string[];
    };
    after?: {
      score: number;
      real_score?: number;
      label?: string;
      breakdown?: {
        keyword_match: number;
        experience_relevance: number;
        education_match: number;
        structure_quality: number;
      } | null;
      matched_skills?: string[];
      missing_skills?: string[];
      improvement?: number;
    } | null;
    ai_insights: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  };
  section_analysis: null;
  resume_quality?: ResumeQualityScore | null;
  comprehensive_feedback?: ComprehensiveFeedback | null;
  optimized_resume: {
    url?: string;
    file_url?: string;
    pdf_url?: string;
    structured_data?: any;
  } | null;
  note: string;
}

export interface OptimizationResult {
  atsScoreAfter: number;
  analysis: {
    optimized_file_url: boolean;
    id: string;
    resume_id: string;
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
    url: string;
    pdf_url: any;
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
      display_score: number;
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
  changeType: "added" | "removed" | "modified" | "reordered";
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
  message: any;
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

// Section Analysis types (kept for reference)
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
  status: "good" | "needs_improvement" | "poor";
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
  status: "good" | "needs_improvement" | "poor";
  overall_score: number;
  summary: string;
  jobs: WorkExperienceJobAnalysis[];
}

export interface WorkExperienceJobAnalysis {
  company: string;
  title: string;
  status: "good" | "needs_improvement" | "poor";
  score: number;
  issues: SectionIssue[];
}

export interface SectionIssue {
  type: "error" | "warning" | "suggestion" | "missing" | "ats_optimization";
  severity: "critical" | "high" | "medium" | "low";
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
  priority: "high" | "medium" | "low";
}
