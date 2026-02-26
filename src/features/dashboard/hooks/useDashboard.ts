import { useState, useEffect, useCallback } from "react";
import { DashboardStats, DashboardActivityItem, AnalysesMeta } from "@/types/dashboard.types";
import { apiClient } from "@/features/resume/services/resumeService";
import { AxiosError } from "axios";

const _PAGE_LIMIT = 20;

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentList, setRecentList] = useState<DashboardActivityItem[]>([]);
  const [Meta, setMeta] = useState<AnalysesMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async (page = 1): Promise<AnalysesMeta | null> => {
    setLoadingList(true);
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: {
          analyses: Array<{
            id: string;
            job_title?: string;
            jobTitle?: string;
            created_at?: string;
            createdAt?: string;
            ats_score?: number | null;
            atsScore?: number | null;
          }>;
          meta: { page: number; limit: number; total: number; totalPages: number };
        };
      }>("/profile/analyses/v2", { params: { page, limit: _PAGE_LIMIT } });
      const data = res.data?.data;
      if (!res.data.success || !data) {
        setRecentList([]);
        setMeta(null);
        return null;
      }
      const list: DashboardActivityItem[] = (data.analyses ?? []).map((a: any) => ({
        id: a.id,
        jobTitle: a.job_title ?? a.jobTitle ?? "",
        createdAt: a.created_at ?? a.createdAt ?? "",
        atsScore: a.ats_score ?? a.atsScore ?? null,
      }));
      setRecentList(list);
      const meta = data.meta;
      const analysesMeta: AnalysesMeta = {
        page: meta.page ?? page,
        limit: meta.limit ?? _PAGE_LIMIT,
        total: meta.total ?? 0,
        totalPages: meta.totalPages ?? 1,
      };
      setMeta(analysesMeta);
      return analysesMeta;
    } catch (_) {
      setRecentList([]);
      setMeta(null);
      return null;
    } finally {
      setLoadingList(false);
    }
  }, []);

  const fetchDashboardStats = async (retryCount = 0): Promise<void> => {
    const maxRetries = 3;
    const retryDelay = 500;

    try {
      setLoading(true);
      setError(null);

      // Only GET /profile/analyses/v2 — no /dashboard/stats
      const analysesMeta = await fetchAnalyses(1);
      const total = analysesMeta?.total ?? 0;
      setStats({
        recentActivity: [],
        averageAtsScore: null,
        resumesAnalyzed: 0,
        optimizations: 0,
        AnalysesCount: total,
        recentAnalyses: undefined,
      });
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
    recentList,
    Meta,
    loadingList,
    loading,
    error,
    refetch: () => fetchDashboardStats(0),
    fetchPage: fetchAnalyses,
  };
};
