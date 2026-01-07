export interface AccountStats {
  totalResumes: number;
  totalAnalyses: number;
  totalOptimizations: number;
  averageScore: number;
  accountAge: number;
  lastLogin: string | null;
  loginCount: number;
}

export interface RecentAnalysis {
  id: string;
  ats_score_before: number;
  ats_score_after: number | null;
  job_title: string;
  created_at: string;
}

export interface Subscription {
  plan: string;
  active: boolean;
  daysRemaining: number | null;
}
