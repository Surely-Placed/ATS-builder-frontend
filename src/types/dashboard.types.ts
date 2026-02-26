export interface DashboardStats {
  resumesAnalyzed: number;
  averageAtsScore: number | null;
  /**
   * Legacy optimizations count (kept for backwards compatibility).
   * For ATS Builder , prefer AnalysesCount.
   */
  optimizations: number;
  recentActivity: RecentActivity[];
  /** Total number of  analyses run by the user */
  AnalysesCount?: number;
  /** Recent  analyses metadata for quick links/overview */
  recentAnalyses?: RecentAnalysis[];
}

export interface RecentActivity {
  id: string;
  resumeId: string;
  jobId: string;
  jobTitle: string;
  atsScoreBefore: number | null;
  atsScoreAfter: number | null;
  scoreImprovement: number | null;
  status: string;
  createdAt: string;
  optimizedFileUrl?: string | null; // URL to the optimized resume PDF
}

export interface RecentAnalysis {
  id: string;
  job_title: string;
  created_at: string;
}

/** Item shown in Recent Activity (-only list from GET /profile/analyses/) */
export interface DashboardActivityItem {
  id: string;
  jobTitle: string;
  createdAt: string;
  /** ATS score when available (from ats_score / atsScore in API) */
  atsScore?: number | null;
}

/** Pagination meta for  analyses list */
export interface AnalysesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
