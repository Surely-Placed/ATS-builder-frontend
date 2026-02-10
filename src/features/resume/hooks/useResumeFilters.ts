import { useState, useEffect, useRef, useCallback } from "react";
import { apiClient } from "@/features/resume/services/resumeService";
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

export const useResumeFilters = (filter: "all" | "uploaded" | "optimized" = "all") => {
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
        // Silent fail for counts
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

      // Always fetch ALL valid resumes (limit increased to 1000 to ensure we get everything for accurate counts)
      const response = await apiClient.get<{
        success: boolean;
        data: { resumes?: ResumeWithStatus[] } | ResumeWithStatus[];
        message?: string;
      }>(`/resume?limit=1000`, {
        cancelToken: source.token,
      });

      if (response.data.success) {
        // Handle both response structures
        const resumesData = response.data.data;
        let basicResumes: any[] = [];

        // Helper to normalize resume data
        const normalizeResume = (raw: any): ResumeWithStatus => {
          return {
            id: raw.id,
            user_id: raw.user_id || raw.userId,
            original_file_url: raw.original_file_url || raw.originalFileUrl,
            optimized_file_url: raw.optimized_file_url || raw.optimizedFileUrl || null,
            storage_path: raw.storage_path || raw.storagePath || null,
            created_at: raw.created_at || raw.createdAt,
            status: raw.status,
            hasAnalysis: raw.has_analysis || raw.hasAnalysis || false,
            latestAnalysis: raw.latest_analysis || raw.latestAnalysis
              ? {
                id: raw.latest_analysis?.id || raw.latestAnalysis?.id,
                jobTitle: raw.latest_analysis?.job_title || raw.latestAnalysis?.jobTitle || '',
                atsScoreBefore: raw.latest_analysis?.ats_score_before ?? raw.latestAnalysis?.atsScoreBefore ?? 0,
                atsScoreAfter: raw.latest_analysis?.ats_score_after ?? raw.latestAnalysis?.atsScoreAfter ?? null,
                createdAt: raw.latest_analysis?.created_at || raw.latestAnalysis?.createdAt,
              }
              : null
          };
        };

        if (Array.isArray(resumesData)) {
          basicResumes = resumesData;
        } else if (
          resumesData &&
          typeof resumesData === "object" &&
          "resumes" in resumesData &&
          Array.isArray(resumesData.resumes)
        ) {
          basicResumes = resumesData.resumes;
        }

        let resumesArray = basicResumes.map(normalizeResume);

        // Fetch analyses to map to resumes (client-side join to avoid N+1 requests)
        try {
          // Fetch recent analyses (limit 1000 to match resume limit)
          const analysesResp = await apiClient.get<any>('/profile/analyses?limit=1000');

          if (analysesResp.data.success) {
            const analyses = analysesResp.data.data.analyses || [];

            // Create a map for quick lookup: resume_id -> analysis
            const analysisMap = new Map();
            analyses.forEach((analysis: any) => {
              // If multiple analyses exist for one resume, the latest one (first in list usually) wins
              if (!analysisMap.has(analysis.resume_id)) {
                analysisMap.set(analysis.resume_id, analysis);
              }
            });

            // Merge analysis data into resumes
            resumesArray = resumesArray.map(resume => {
              const matchedAnalysis = analysisMap.get(resume.id);
              if (matchedAnalysis) {
                // Enrich resume with missing analysis data
                return {
                  ...resume,
                  optimized_file_url: resume.optimized_file_url || matchedAnalysis.optimized_resume_url || null,
                  hasAnalysis: true,
                  latestAnalysis: resume.latestAnalysis || {
                    id: matchedAnalysis.id,
                    jobTitle: matchedAnalysis.job_title || '',
                    atsScoreBefore: matchedAnalysis.ats_score_before || 0,
                    atsScoreAfter: matchedAnalysis.ats_score_after || null,
                    createdAt: matchedAnalysis.created_at
                  }
                };
              }
              return resume;
            });
          }
        } catch (err) {
          console.warn("Failed to fetch/merge analyses with documents", err);
          // Continue with basic data - don't block UI
        }

        // Calculate counts client-side to ensure consistency with filter logic
        const optimizedCount = resumesArray.filter(r =>
          !!r.optimized_file_url || (r.latestAnalysis?.atsScoreAfter !== null && r.latestAnalysis?.atsScoreAfter !== undefined)
        ).length;

        const allCount = resumesArray.length;

        // Update counts state with calculated values
        setCounts({
          all: allCount,
          published: optimizedCount, // Mapping 'Optimized' to 'published' key for UI
          drafts: allCount - optimizedCount // Remaining are 'Uploaded' (mapped to 'drafts')
        });

        // Client-side filtering
        const filteredResumes = resumesArray.filter(resume => {
          const isOptimized = !!resume.optimized_file_url || (resume.latestAnalysis?.atsScoreAfter !== null && resume.latestAnalysis?.atsScoreAfter !== undefined);

          if (filter === 'optimized') return isOptimized;
          if (filter === 'uploaded') return !isOptimized;
          return true; // 'all'
        });

        setResumes(filteredResumes);
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

  // Fetch counts only once on mount - kept for initial fast load if needed, but fetchResumes will overwrite with accurate counts
  useEffect(() => {
    // We can rely on fetchResumes to set accurate counts now.
    // fetchCounts(); 
  }, []);

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
    refetchCounts: fetchResumes, // Make refetchCounts just trigger full fetch to recalculate
  };
};
