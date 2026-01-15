import { useState, useEffect } from "react";
import { DashboardStats } from "../types/dashboard.types";
import { apiClient } from "../services/resumeApi";
import { AnalysisService } from "../services/analysis/analysisService";
import { getDisplayScores } from "../utils/scoreUtils";
import { AxiosError } from "axios";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async (retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    const retryDelay = 500; // Start with 500ms delay

    try {
      console.debug('useDashboard: fetchDashboardStats start, retryCount=', retryCount);
      setLoading(true);
      setError(null);

      const response = await apiClient.get<{
        success: boolean;
        data: DashboardStats;
        message?: string;
      }>("/dashboard/stats");

      if (response.data.success) {
        const rawData = response.data.data as any;
        console.debug('useDashboard: /dashboard/stats response ->', rawData);
                
        let statsData: DashboardStats;
      
        // Handle snake_case to camelCase conversion if needed
        if (rawData.recent_activity && !rawData.recentActivity) {
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
            })),
            averageAtsScore: rawData.average_ats_score ?? rawData.averageAtsScore ?? null,
            resumesAnalyzed: rawData.resumes_analyzed ?? rawData.resumesAnalyzed ?? 0,
            optimizations: mappedOptimizations,
          };
        } else {
          const directOptimizations = rawData.optimizations_completed ?? rawData.optimizations ?? 0;
          statsData = rawData as DashboardStats;
          statsData.optimizations = directOptimizations;
        }
      
        // Always enrich activity data and compute optimizations count from actual data
        let optimizationsCount = 0;
        const enrichedActivity = await Promise.all(
          statsData.recentActivity.map(async (activity) => {
            let enrichedAct = activity;

            // Always try to fetch fresh data for accuracy
            try {
              const analysisResult = await AnalysisService.getAnalysis(activity.id);

              // Use getDisplayScores to properly extract scores (handles all formats)
              const displayScores = getDisplayScores({
                analysis: analysisResult.analysis,
                ats_analysis: analysisResult.ats_analysis,
              });

              enrichedAct = {
                ...activity,
                atsScoreBefore: displayScores.scoreBefore,
                atsScoreAfter: displayScores.scoreAfter,
                scoreImprovement: displayScores.improvement,
              };

              // Count this as an optimization if it has an after score
              if (displayScores.scoreAfter !== null && displayScores.scoreAfter !== undefined) {
                optimizationsCount++;
              }
            } catch (err) {
              // If fetch fails, check existing data
              if (activity.atsScoreAfter !== null && activity.atsScoreAfter !== undefined) {
                optimizationsCount++;
              }
            }

            return enrichedAct;
          })
        );

        // Override the optimizations count with our computed value
        statsData.optimizations = optimizationsCount;

        // Attempt to read the authoritative total optimizations from the profile stats
        try {
          const profileResp = await apiClient.get<{ success: boolean; data: any }>(
            "/profile/stats"
          );
          if (profileResp.data?.success && profileResp.data.data?.totalOptimizations !== undefined) {
            const profileOptimizations = profileResp.data.data.totalOptimizations;
            console.debug('useDashboard: profile.totalOptimizations ->', profileOptimizations, 'computedOptimizations=', optimizationsCount);
            // Prefer profile's totalOptimizations as the authoritative value
            statsData.optimizations = profileOptimizations;
          }
        } catch (e) {
          // ignore - fall back to computed value
        }

        console.debug('useDashboard: enrichedActivity ->', enrichedActivity, 'optimizationsCount=', optimizationsCount);

        setStats({
          ...statsData,
          recentActivity: enrichedActivity,
        });
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
        return fetchDashboardStats(retryCount + 1);
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
  };

  useEffect(() => {
    // Add a small delay to ensure cookie is set after login
    const timer = setTimeout(() => {
      fetchDashboardStats();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: () => fetchDashboardStats(0),
  };
};
