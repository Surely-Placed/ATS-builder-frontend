export interface AccountStats {
  totalResumes: number;
  totalAnalyses: number;
  totalOptimizations: number;
  /** Total number of ATS Builder  analyses */
  totalAnalyses: number;
  averageScore: number;
  accountAge: number;
  lastLogin: string | null;
  loginCount: number;
}

/**  analysis list item (from GET /api/profile/analyses/) */
export interface RecentAnalysis {
  id: string;
  job_title: string;
  created_at: string;
}

export interface Subscription {
  plan: string;
  active: boolean;
  daysRemaining: number | null;
}
