export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  code?: string;
}

export interface AnalyzeResult {
  analysisId: string;
  explainedJob: string;
  candidateAnalysis: string;
  improvedSkills: string;
  improvedExperience: string[];
  improvedSummary: string;
}

/** Single  analysis from GET /api/analyze//:id (API may return snake_case) */
export interface AnalysisDetail {
  id: string;
  analysisId?: string;
  job_title?: string;
  jobTitle?: string;
  improved_skills?: string | null;
  improvedSkills?: string;
  improved_experience?: string[] | null;
  improvedExperience?: string[];
  improved_summary?: string | null;
  improvedSummary?: string;
  summary?: string | null;
  created_at?: string;
  createdAt?: string;
}

export interface PdfBreakdownItem {
  module: string;
  score: number;
  feedback?: string;
}

export interface PdfResult {
  url: string;
  atsScore: number;
  atsBreakdown: PdfBreakdownItem[];
}

export interface UserResumeDetailInput {
  professional_name: string;
  professional_email: string;
  professional_phone: string;
  linkedIn_url?: string;
  github_url?: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    start_date: string; // ISO date
    end_date: string | null;
    description: string[];
  }>;
  /** Backend accepts string[] (legacy) or { description, year?, link? }[] */
  achievements?: (string | { description: string; year?: string | number; link?: string })[];
  projects?: Array<{
    name: string;
    description: string;
    link: string;
    year: number;
  }>;
  eduction: Array<{
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string | null;
  }>;
}

