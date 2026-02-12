// New backend: { totalResumes, totalAnalyses, totalOptimizations } (no averageScore, accountAge, lastLogin, loginCount)
export interface AccountStats {
  totalResumes: number;
  totalAnalyses: number;
  totalOptimizations: number;
}

// New backend: each item has id, ats_score_before, ats_score_after, created_at, job_title, resume_id
export interface RecentAnalysis {
  id: string;
  ats_score_before: number | null;
  ats_score_after: number | null;
  created_at: string;
  job_title: string | null;
  resume_id: string;
}

export interface Subscription {
  plan: string;
  active: boolean;
  daysRemaining: number | null;
}
