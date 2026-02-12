import { useState, useEffect, useCallback } from "react";
import { DashboardStats } from "@/types/dashboard.types";
import { apiClient } from "@/features/resume/services/resumeService";
import { AxiosError } from "axios";

const PER_PAGE = 20;

export const useDashboard = (page: number = 1) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDashboardStats = useCallback(async (pageNum: number, retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    const retryDelay = 500;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get<{
        success: boolean;
        data: Record<string, unknown>;
        message?: string;
      }>("/dashboard/stats", {
        params: { page: pageNum, limit: PER_PAGE },
      });

      if (response.data.success) {
        const rawData = response.data.data as any;
        let statsData: DashboardStats;

        // New backend API: { totalResumes, resumes[], page, limit, totalPages } + jobTitle per item
        if (rawData.totalResumes !== undefined && Array.isArray(rawData.resumes)) {
          const resumes = rawData.resumes as Array<{
            // Prefer analysisId for view/resume actions when provided by backend
            analysisId?: string | null;
            resumeId: string;
            jobTitle?: string | null;
            atsScoreBefore: number | null;
            atsScoreAfter: number | null;
            optimizedFileUrl: string | null;
          }>;
          const totalResumes = rawData.totalResumes ?? resumes.length;
          setTotalPages(Math.max(1, Number(rawData.totalPages) ?? 1));
          const optimizationsCount = resumes.filter(
            (r) => r.atsScoreAfter !== null && r.atsScoreAfter !== undefined
          ).length;
          const scores = resumes.flatMap((r) =>
            [r.atsScoreBefore, r.atsScoreAfter].filter(
              (s): s is number => s !== null && s !== undefined
            )
          );
          const averageAtsScore =
            scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

          statsData = {
            resumesAnalyzed: totalResumes,
            averageAtsScore,
            optimizations: optimizationsCount,
            recentActivity: resumes.map((r) => {
              const before = r.atsScoreBefore ?? 0;
              const after = r.atsScoreAfter;
              const improvement =
                after !== null && after !== undefined ? after - before : null;
              return {
                // Use analysisId when available so dashboard “View”/“Resume Optimization”
                // actions navigate by analysis instead of just resume.
                id: r.analysisId || r.resumeId,
                resumeId: r.resumeId,
                jobId: r.resumeId,
                jobTitle: (r.jobTitle && r.jobTitle.trim()) || `Resume #${r.resumeId.substring(0, 8)}`,
                atsScoreBefore: before,
                atsScoreAfter: after ?? null,
                scoreImprovement: improvement,
                status:
                  after !== null && after !== undefined
                    ? "optimization_completed"
                    : "optimization_pending",
                createdAt: new Date().toISOString(),
                optimizedFileUrl: r.optimizedFileUrl ?? null,
              };
            }),
          };
        } else if (rawData.recent_activity && !rawData.recentActivity) {
          // Legacy: snake_case recent_activity
          const mappedOptimizations = rawData.optimizations_completed ?? rawData.optimizations ?? 0;
          statsData = {
            recentActivity: rawData.recent_activity.map((activity: any) => ({
              id: activity.id,
              resumeId: activity.resume_id || activity.resumeId,
              jobId: activity.job_id || activity.jobId,
              jobTitle: activity.job_title || activity.jobTitle,
              atsScoreBefore:
                activity.ats_score_before ??
                (activity.atsScoreBefore !== undefined ? activity.atsScoreBefore : null),
              atsScoreAfter: activity.ats_score_after ?? activity.atsScoreAfter ?? null,
              scoreImprovement: activity.score_improvement ?? activity.scoreImprovement ?? null,
              status: activity.status,
              createdAt: activity.created_at || activity.createdAt,
              optimizedFileUrl: activity.optimized_file_url || activity.optimizedFileUrl || null,
            })),
            averageAtsScore: rawData.average_ats_score ?? rawData.averageAtsScore ?? null,
            resumesAnalyzed: rawData.resumes_analyzed ?? rawData.resumesAnalyzed ?? 0,
            optimizations: mappedOptimizations,
          };
          const recentByResume = statsData.recentActivity.reduce((acc: Record<string, any>, activity: any) => {
            const key = activity.resumeId || activity.id;
            if (!acc[key]) acc[key] = activity;
            else {
              const existingTime = new Date(acc[key].createdAt).getTime();
              const currentTime = new Date(activity.createdAt).getTime();
              if (currentTime > existingTime) acc[key] = activity;
            }
            return acc;
          }, {});
          statsData.recentActivity = Object.values(recentByResume);
          statsData.optimizations = statsData.recentActivity.filter(
            (a) => a.atsScoreAfter != null
          ).length;
        } else {
          const directOptimizations = rawData.optimizations_completed ?? rawData.optimizations ?? 0;
          statsData = rawData as DashboardStats;
          statsData.optimizations = directOptimizations;
        }

        setStats(statsData);
      } else {
        throw new Error(response.data.message || "Failed to fetch dashboard stats");
      }
    } catch (err: any) {
      const axiosError = err as AxiosError;

      // Handle network errors (no response received)
      if (!axiosError.response) {
        // Network error - could be CORS, connection refused, etc.
        if (
          err.code === "ERR_NETWORK" ||
          err.message?.includes("Network Error") ||
          err.message?.includes("network error")
        ) {
          const errorMessage =
            "Network error. Please check your internet connection and try again. If the problem persists, the server may be temporarily unavailable.";
          setError(errorMessage);
          setLoading(false);
          return;
        }

        // Timeout error
        if (err.code === "ECONNABORTED") {
          setError("Request timeout. Please try again.");
          setLoading(false);
          return;
        }

        // CORS error (Safari specific)
        if (err.message?.includes("CORS") || err.message?.includes("cross-origin")) {
          const errorMessage =
            "CORS error. Please check if the API server is configured to allow requests from this origin.";
          setError(errorMessage);
          setLoading(false);
          return;
        }
      }

      // Retry on 401 (Unauthorized) - token might not be set yet
      if (axiosError.response?.status === 401 && retryCount < maxRetries) {
        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, retryCount);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchDashboardStats(pageNum, retryCount + 1);
      }

      // Extract error message
      let errorMessage = "An error occurred while fetching dashboard data";
      if (
        axiosError.response?.data &&
        typeof axiosError.response.data === "object" &&
        "message" in axiosError.response.data
      ) {
        errorMessage = (axiosError.response.data as any).message || errorMessage;
      } else if (axiosError instanceof Error && axiosError.message) {
        errorMessage = axiosError.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDashboardStats(page);
    }, 100);
    return () => clearTimeout(timer);
  }, [page, fetchDashboardStats]);

  return {
    stats,
    loading,
    error,
    refetch: () => fetchDashboardStats(page, 0),
    totalPages,
  };
};
