export interface DashboardStats {
  resumesAnalyzed: number;
  averageAtsScore: number | null;
  optimizations: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  resumeId: string;
  jobId: string;
  jobTitle: string;
  atsScoreBefore: number;
  atsScoreAfter: number | null;
  scoreImprovement: number | null;
  status: string;
  createdAt: string;
}

