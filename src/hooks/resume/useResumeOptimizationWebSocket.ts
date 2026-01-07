import { useState, useEffect, useRef, useCallback } from "react";
import { socketService, JobStatusEvent } from "../../services/socketService";
import { useAuth } from "../../context/AuthContext";
import { OptimizationResult } from "../../services/analysis/types";
import { AnalysisService } from "../../services/analysis";
import {
  trackOptimizationComplete,
  trackOptimizationFailed,
  trackConversion,
} from "../../utils/analytics";

export interface UseWebSocketOptions {
  jobId: string | null;
  analysisId: string;
  onComplete?: (result: OptimizationResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseWebSocketReturn {
  status: "idle" | "starting" | "running" | "complete" | "failed";
  progress: number;
  error: string | null;
  result: OptimizationResult | null;
  optimizedResumeUrl: string | null;
  isConnected: boolean;
  setJobId: (jobId: string | null) => void;
}

/**
 * Hook for managing WebSocket connection and job status updates
 */
export function useResumeOptimizationWebSocket({
  jobId,
  analysisId,
  onComplete,
  onError,
  onProgress,
}: UseWebSocketOptions): UseWebSocketReturn {
  const { user } = useAuth();
  const userId = user?.uid || "";
  const [status, setStatus] = useState<"idle" | "starting" | "running" | "complete" | "failed">(
    "idle"
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const statusCallbackRef = useRef<((data: JobStatusEvent) => void) | null>(null);

  // Extract optimized resume URL from multiple possible locations
  const extractOptimizedUrl = useCallback(
    (optimizationResult: OptimizationResult | any): string | null => {
      return (
        optimizationResult?.optimized_resume?.file_url ||
        optimizationResult?.optimized_resume?.url ||
        optimizationResult?.optimized_resume?.pdf_url ||
        optimizationResult?.analysis?.optimized_file_url ||
        optimizationResult?.pdf_url ||
        null
      );
    },
    []
  );

  // Fetch optimized URL from API if not available in WebSocket result
  const fetchOptimizedUrl = useCallback(async (analysisId: string) => {
    try {
      const response = await AnalysisService.getAnalysis(analysisId);
      const data = response.data || response;

      const url =
        data?.optimized_resume?.file_url ||
        data?.optimized_resume?.url ||
        data?.optimized_resume?.pdf_url ||
        data?.analysis?.optimized_file_url ||
        data?.resume?.optimized_file_url ||
        null;

      if (url) {
        setOptimizedResumeUrl(url);
      }
    } catch (err) {
      // Non-critical error - we already have the result from WebSocket
    }
  }, []);

  /**
   * Fetch complete optimization data with all fields after optimization completes
   * This ensures we have the latest data from the database with all required fields
   */
  const fetchCompleteOptimizationData = useCallback(async (analysisId: string) => {
    try {
      const response = await AnalysisService.getAnalysis(analysisId);
      const fullData = response.data || response;
      const data = fullData.data || fullData;

      // Extract ATS scores from multiple possible locations
      const atsScoreBefore =
        data?.analysis?.ats_score_before ??
        data?.ats_analysis?.before?.score ??
        data?.analysis?.display_score_before ??
        0;

      const atsScoreAfter =
        data?.analysis?.ats_score_after ??
        data?.ats_analysis?.after?.score ??
        data?.analysis?.display_score_after ??
        null;

      // Build complete optimization result with all required fields
      const optimizedResult: OptimizationResult = {
        analysis: {
          id: data?.analysis?.id || "",
          resume_id: data?.analysis?.resume_id || "",
          job_id: data?.analysis?.job_id || "",
          ats_score_before: atsScoreBefore,
          ats_score_after: atsScoreAfter ?? null,
          score_improvement:
            atsScoreAfter !== null && atsScoreBefore !== null ? atsScoreAfter - atsScoreBefore : 0,
          display_score_before: data?.analysis?.display_score_before ?? atsScoreBefore,
          display_score_after: data?.analysis?.display_score_after ?? atsScoreAfter,
          display_improvement:
            data?.analysis?.display_improvement ??
            (atsScoreAfter !== null && atsScoreBefore !== null
              ? atsScoreAfter - atsScoreBefore
              : null),
          created_at: data?.analysis?.created_at || new Date().toISOString(),
        },
        ats_analysis: data?.ats_analysis || {
          before: {
            score: atsScoreBefore,
            real_score: data?.analysis?.ats_score_before ?? atsScoreBefore,
            label: "Current ATS Score",
            breakdown: data?.ats_analysis?.before?.breakdown ?? null,
            matched_skills: data?.ats_analysis?.before?.matched_skills ?? [],
            missing_skills: data?.ats_analysis?.before?.missing_skills ?? [],
          },
          after:
            atsScoreAfter !== null
              ? {
                  score: atsScoreAfter,
                  real_score: data?.analysis?.ats_score_after ?? atsScoreAfter,
                  label: "Optimized ATS Score",
                  breakdown: data?.ats_analysis?.after?.breakdown ?? null,
                  matched_skills: data?.ats_analysis?.after?.matched_skills ?? [],
                  missing_skills: data?.ats_analysis?.after?.missing_skills ?? [],
                  improvement: atsScoreAfter - atsScoreBefore,
                }
              : null,
          ai_insights: data?.ats_analysis?.ai_insights || {
            strengths: [],
            weaknesses: [],
            recommendations: [],
          },
        },
        final_audit:
          data?.final_audit ||
          (atsScoreAfter !== null
            ? {
                integrity_verified: true,
                quality_score: atsScoreAfter,
                new_ats_score: atsScoreAfter,
                score_improvement: atsScoreAfter - atsScoreBefore,
                improvements_made: data?.final_audit?.improvements_made ?? [],
                remaining_gaps: data?.final_audit?.remaining_gaps ?? [],
                final_recommendations: data?.final_audit?.final_recommendations ?? [],
                ready_for_submission: true,
              }
            : null),
        optimized_resume: data?.optimized_resume || null,
        original_resume: data?.original_resume || null,
        keyword_alignment: data?.keyword_alignment || null,
      };

      // Extract optimized resume URL
      const optimizedResumeUrl =
        optimizedResult.optimized_resume?.file_url ||
        optimizedResult.optimized_resume?.url ||
        optimizedResult.optimized_resume?.pdf_url ||
        data?.analysis?.optimized_file_url ||
        null;

      return {
        optimizedResult,
        optimizedResumeUrl,
        atsScoreBefore,
        atsScoreAfter,
        hasOptimizedPdf: !!optimizedResumeUrl,
      };
    } catch (error: any) {
      throw error;
    }
  }, []);

  /**
   * Poll for optimization completion if WebSocket is not available
   */
  const pollForOptimizationComplete = useCallback(
    async (analysisId: string, maxAttempts: number = 30) => {
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          const completeData = await fetchCompleteOptimizationData(analysisId);

          if (completeData.atsScoreAfter !== null) {
            return completeData; // Optimization complete with all data
          }
        } catch (error) {
          // Continue polling on error
          if (i === maxAttempts - 1) {
            throw error;
          }
        }
      }
      throw new Error("Optimization timeout");
    },
    [fetchCompleteOptimizationData]
  );

  // Setup WebSocket listener
  useEffect(() => {
    if (!userId) {
      return;
    }

    // Setup job status listener
    const handleJobStatus = (data: JobStatusEvent) => {
      if (jobId && data.jobId === jobId) {
        // Update status and progress
        const newStatus = data.status as any;
        const newProgress = data.progress || 0;

        setStatus(newStatus);
        setProgress(newProgress);

        if (onProgress) {
          onProgress(data.progress || 0);
        }

        if (data.status === "complete") {
          const optimizationResult = data.result as OptimizationResult;
          setResult(optimizationResult);

          // Extract optimized resume URL from WebSocket result
          const resumeUrl = extractOptimizedUrl(optimizationResult);
          if (resumeUrl) {
            setOptimizedResumeUrl(resumeUrl);
          }

          setStatus("complete");

          // Wait a moment for database to update, then fetch complete optimization data
          setTimeout(async () => {
            try {
              const completeData = await fetchCompleteOptimizationData(analysisId);

              // Update optimized resume URL
              if (completeData.optimizedResumeUrl) {
                setOptimizedResumeUrl(completeData.optimizedResumeUrl);
              }

              // Use the complete optimization result from API (includes all fields)
              if (completeData.atsScoreAfter !== null) {
                // Merge WebSocket result with API result, preferring API data but preserving WebSocket data if API is missing
                const mergedResult: OptimizationResult = {
                  ...completeData.optimizedResult,
                  // Prefer WebSocket final_audit if it has more data, otherwise use API
                  final_audit:
                    completeData.optimizedResult.final_audit || optimizationResult.final_audit,
                  // Prefer WebSocket optimized_resume if it has more data, otherwise use API
                  optimized_resume:
                    completeData.optimizedResult.optimized_resume ||
                    optimizationResult.optimized_resume,
                };

                setResult(mergedResult);

                // Track optimization completion with updated scores
                const scoreBefore = completeData.atsScoreBefore;
                const scoreAfter = completeData.atsScoreAfter;
                const scoreImprovement = scoreAfter - scoreBefore;
                const tokenUsage = data.token_usage || optimizationResult.token_usage;

                trackOptimizationComplete(
                  analysisId,
                  scoreImprovement,
                  scoreBefore,
                  scoreAfter,
                  tokenUsage
                );
                trackConversion("optimization");

                // Call onComplete with merged result
                if (onComplete) {
                  onComplete(mergedResult);
                }
              } else {
                // Fallback: Use WebSocket result if API doesn't have scores yet
                if (optimizationResult?.analysis) {
                  const scoreBefore = optimizationResult.analysis.ats_score_before;
                  const scoreAfter = optimizationResult.analysis.ats_score_after;
                  const scoreImprovement = optimizationResult.analysis.score_improvement;
                  const tokenUsage = data.token_usage || optimizationResult.token_usage;

                  trackOptimizationComplete(
                    analysisId,
                    scoreImprovement,
                    scoreBefore,
                    scoreAfter,
                    tokenUsage
                  );
                  trackConversion("optimization");
                }

                if (onComplete) {
                  onComplete(optimizationResult);
                }
              }
            } catch (error) {
              // Non-critical error - use WebSocket result as fallback
              // Track with WebSocket data as fallback
              if (optimizationResult?.analysis) {
                const scoreBefore = optimizationResult.analysis.ats_score_before;
                const scoreAfter = optimizationResult.analysis.ats_score_after;
                const scoreImprovement = optimizationResult.analysis.score_improvement;
                const tokenUsage = data.token_usage || optimizationResult.token_usage;

                trackOptimizationComplete(
                  analysisId,
                  scoreImprovement,
                  scoreBefore,
                  scoreAfter,
                  tokenUsage
                );
                trackConversion("optimization");
              }

              if (onComplete) {
                onComplete(optimizationResult);
              }
            }
          }, 1500); // Wait 1.5 seconds for database to update
        }

        if (data.status === "failed") {
          trackOptimizationFailed(analysisId, data.error || "Unknown error");
          setError(data.error || "Optimization failed");
          setStatus("failed");

          if (onError) {
            onError(data.error || "Optimization failed");
          }
        }
      }
    };

    // Register the listener
    statusCallbackRef.current = handleJobStatus;
    socketService.onJobStatus(handleJobStatus);

    // Connect to WebSocket
    const connectWebSocket = async () => {
      try {
        if (!user) {
          setError("User not authenticated");
          setIsConnected(false);
          return;
        }

        const firebaseIdToken = await user.getIdToken();
        socketService.connect({
          userId: user.uid,
          firebaseIdToken: firebaseIdToken,
        });

        setIsConnected(true);

        // Re-register listener after connection
        if (statusCallbackRef.current) {
          socketService.onJobStatus(statusCallbackRef.current);
        }
      } catch (error) {
        setError("Failed to connect to server");
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // Check connection status periodically
    const checkConnection = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(checkConnection);
      if (statusCallbackRef.current) {
        socketService.offJobStatus(statusCallbackRef.current);
        statusCallbackRef.current = null;
      }
    };
  }, [
    userId,
    user,
    jobId,
    analysisId,
    onComplete,
    onError,
    onProgress,
    extractOptimizedUrl,
    fetchOptimizedUrl,
    fetchCompleteOptimizationData,
  ]);

  // Fetch optimized URL when status is complete but URL is missing
  useEffect(() => {
    if (status === "complete" && analysisId && !optimizedResumeUrl && result) {
      fetchOptimizedUrl(analysisId);
    }
  }, [status, analysisId, optimizedResumeUrl, result, fetchOptimizedUrl]);

  const setJobId = useCallback((newJobId: string | null) => {
    // This will trigger the useEffect above to update jobId
  }, []);

  return {
    status,
    progress,
    error,
    result,
    optimizedResumeUrl,
    isConnected,
    setJobId,
  };
}

/**
 * Standalone function to fetch complete optimization data with all fields
 * Can be used independently or as a fallback when WebSocket is not available
 */
export async function fetchCompleteOptimizationData(analysisId: string) {
  try {
    const response = await AnalysisService.getAnalysis(analysisId);
    const fullData = response.data || response;
    const data = fullData.data || fullData;

    // Extract ATS scores from multiple possible locations
    const atsScoreBefore =
      data?.analysis?.ats_score_before ??
      data?.ats_analysis?.before?.score ??
      data?.analysis?.display_score_before ??
      0;

    const atsScoreAfter =
      data?.analysis?.ats_score_after ??
      data?.ats_analysis?.after?.score ??
      data?.analysis?.display_score_after ??
      null;

    // Build complete optimization result with all required fields
    const optimizedResult: OptimizationResult = {
      analysis: {
        id: data?.analysis?.id || "",
        resume_id: data?.analysis?.resume_id || "",
        job_id: data?.analysis?.job_id || "",
        ats_score_before: atsScoreBefore,
        ats_score_after: atsScoreAfter ?? null,
        score_improvement:
          atsScoreAfter !== null && atsScoreBefore !== null ? atsScoreAfter - atsScoreBefore : 0,
        display_score_before: data?.analysis?.display_score_before ?? atsScoreBefore,
        display_score_after: data?.analysis?.display_score_after ?? atsScoreAfter,
        display_improvement:
          data?.analysis?.display_improvement ??
          (atsScoreAfter !== null && atsScoreBefore !== null
            ? atsScoreAfter - atsScoreBefore
            : null),
        created_at: data?.analysis?.created_at || new Date().toISOString(),
      },
      ats_analysis: data?.ats_analysis || {
        before: {
          score: atsScoreBefore,
          real_score: data?.analysis?.ats_score_before ?? atsScoreBefore,
          label: "Current ATS Score",
          breakdown: data?.ats_analysis?.before?.breakdown ?? null,
          matched_skills: data?.ats_analysis?.before?.matched_skills ?? [],
          missing_skills: data?.ats_analysis?.before?.missing_skills ?? [],
        },
        after:
          atsScoreAfter !== null
            ? {
                score: atsScoreAfter,
                real_score: data?.analysis?.ats_score_after ?? atsScoreAfter,
                label: "Optimized ATS Score",
                breakdown: data?.ats_analysis?.after?.breakdown ?? null,
                matched_skills: data?.ats_analysis?.after?.matched_skills ?? [],
                missing_skills: data?.ats_analysis?.after?.missing_skills ?? [],
                improvement: atsScoreAfter - atsScoreBefore,
              }
            : null,
        ai_insights: data?.ats_analysis?.ai_insights || {
          strengths: [],
          weaknesses: [],
          recommendations: [],
        },
      },
      final_audit:
        data?.final_audit ||
        (atsScoreAfter !== null
          ? {
              integrity_verified: true,
              quality_score: atsScoreAfter,
              new_ats_score: atsScoreAfter,
              score_improvement: atsScoreAfter - atsScoreBefore,
              improvements_made: data?.final_audit?.improvements_made ?? [],
              remaining_gaps: data?.final_audit?.remaining_gaps ?? [],
              final_recommendations: data?.final_audit?.final_recommendations ?? [],
              ready_for_submission: true,
            }
          : null),
      optimized_resume: data?.optimized_resume || null,
      original_resume: data?.original_resume || null,
      keyword_alignment: data?.keyword_alignment || null,
    };

    // Extract optimized resume URL
    const optimizedResumeUrl =
      optimizedResult.optimized_resume?.file_url ||
      optimizedResult.optimized_resume?.url ||
      optimizedResult.optimized_resume?.pdf_url ||
      data?.analysis?.optimized_file_url ||
      null;

    return {
      optimizedResult,
      optimizedResumeUrl,
      atsScoreBefore,
      atsScoreAfter,
      hasOptimizedPdf: !!optimizedResumeUrl,
    };
  } catch (error: any) {
    throw error;
  }
}

/**
 * Poll for optimization completion if WebSocket is not available
 * Useful as a fallback mechanism
 */
export async function pollForCompleteOptimizationData(
  analysisId: string,
  maxAttempts: number = 30
) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const completeData = await fetchCompleteOptimizationData(analysisId);

      // Check if optimization is complete (has score_after)
      if (completeData.atsScoreAfter !== null && completeData.atsScoreAfter !== undefined) {
        return completeData; // Optimization complete with all data
      }
    } catch (error) {
      // Continue polling on error
      if (i === maxAttempts - 1) {
        throw error;
      }
    }
  }
  throw new Error("Optimization timeout");
}
