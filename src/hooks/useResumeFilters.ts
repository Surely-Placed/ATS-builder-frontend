import { useState, useEffect, useRef, useCallback } from "react";
import { apiClient } from "../services/resumeApi";
import axios, { CancelTokenSource } from "axios";

export interface FilterCounts {
  all: number;
  drafts: number;
  published: number;
}

export interface ResumeWithStatus {
  id: string;
  user_id: string;
  original_file_url: string;
  optimized_file_url: string | null;
  storage_path: string | null;
  created_at: string;
  status: "draft" | "published";
  hasAnalysis: boolean;
  latestAnalysis: {
    id: string;
    jobTitle: string;
    atsScoreBefore: number;
    atsScoreAfter: number | null;
    createdAt: string;
  } | null;
}

export const useResumeFilters = (filter: "all" | "drafts" | "published" = "all") => {
  const [counts, setCounts] = useState<FilterCounts>({ all: 0, drafts: 0, published: 0 });
  const [resumes, setResumes] = useState<ResumeWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use refs to prevent multiple simultaneous requests
  const countsFetchingRef = useRef(false);
  const resumesFetchingRef = useRef(false);
  const countsCancelTokenRef = useRef<CancelTokenSource | null>(null);
  const resumesCancelTokenRef = useRef<CancelTokenSource | null>(null);

  // Fetch filter counts with cancellation support
  const fetchCounts = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (countsFetchingRef.current) {
      return;
    }

    try {
      countsFetchingRef.current = true;

      // Cancel previous request if still pending
      if (countsCancelTokenRef.current) {
        countsCancelTokenRef.current.cancel("New request initiated");
      }

      // Create cancel token for this request
      const source = axios.CancelToken.source();
      countsCancelTokenRef.current = source;

      const response = await apiClient.get<{ success: boolean; data: FilterCounts }>(
        "/resume/filters/counts",
        {
          cancelToken: source.token,
        }
      );

      if (response.data.success) {
        setCounts(response.data.data);
      }
    } catch (err: any) {
      // Ignore cancelled requests
      if (axios.isCancel(err)) {
        return;
      }

      if (err.response?.status === 429) {
        return; // Don't set error for rate limiting
      }
      // Don't set error state for cancelled requests
      if (!axios.isCancel(err)) {
        setError(err.message || "Failed to fetch filter counts");
      }
    } finally {
      countsFetchingRef.current = false;
    }
  }, []); // Empty deps - only fetch once on mount

  // Fetch filtered resumes
  const fetchResumes = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (resumesFetchingRef.current) {
      return;
    }

    try {
      resumesFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Cancel previous request if still pending
      if (resumesCancelTokenRef.current) {
        resumesCancelTokenRef.current.cancel("Filter changed");
      }

      // Create cancel token for this request
      const source = axios.CancelToken.source();
      resumesCancelTokenRef.current = source;

      const response = await apiClient.get<{
        success: boolean;
        data: { resumes?: ResumeWithStatus[] } | ResumeWithStatus[];
        message?: string;
      }>(`/resume?filter=${filter}`, {
        cancelToken: source.token,
      });

      if (response.data.success) {
        // Handle both response structures: { data: { resumes: [] } } or { data: [] }
        const resumesData = response.data.data;
        let resumesArray: ResumeWithStatus[] = [];

        if (Array.isArray(resumesData)) {
          resumesArray = resumesData;
        } else if (
          resumesData &&
          typeof resumesData === "object" &&
          "resumes" in resumesData &&
          Array.isArray(resumesData.resumes)
        ) {
          resumesArray = resumesData.resumes;
        }

        setResumes(resumesArray);
      } else {
        throw new Error(response.data.message || "Failed to fetch resumes");
      }
    } catch (err: any) {
      // Ignore cancelled requests - don't set error or update state
      if (axios.isCancel(err)) {
        return; // Finally block will still run
      }

      if (err.response?.status === 429) {
        const errorMessage = "Too many requests. Please wait a moment.";
        setError(errorMessage);
        setResumes([]);
        return; // Finally block will still run
      }

      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      setResumes([]); // Set empty array on error
    } finally {
      setLoading(false);
      resumesFetchingRef.current = false;
    }
  }, [filter]); // Only depends on filter

  // Fetch counts only once on mount
  useEffect(() => {
    fetchCounts();

    // Cleanup: cancel request on unmount
    return () => {
      if (countsCancelTokenRef.current) {
        countsCancelTokenRef.current.cancel("Component unmounted");
      }
    };
  }, [fetchCounts]); // fetchCounts is memoized with useCallback

  // Fetch resumes when filter changes
  useEffect(() => {
    fetchResumes();

    // Cleanup: cancel request on unmount or filter change
    return () => {
      if (resumesCancelTokenRef.current) {
        resumesCancelTokenRef.current.cancel("Filter changed or component unmounted");
      }
    };
  }, [fetchResumes]); // fetchResumes depends on filter

  return {
    counts,
    resumes,
    loading,
    error,
    refetch: fetchResumes,
    refetchCounts: fetchCounts,
  };
};
