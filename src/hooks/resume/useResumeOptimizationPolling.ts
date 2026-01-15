import { useState, useEffect, useRef, useCallback } from "react";
import { OptimizationResult } from "../../services/analysis/types";
import { AnalysisService, OptimizationService } from "../../services/analysis";
import {
  trackOptimizationComplete,
  trackOptimizationFailed,
  trackConversion,
} from "../../utils/analytics";

export interface UseOptimizationStatusOptions {
  jobId: string | null;
  analysisId: string;
  onComplete?: (result: OptimizationResult) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export interface UseOptimizationStatusReturn {
  status: "idle" | "starting" | "running" | "complete" | "failed";
  progress: number;
  error: string | null;
  result: OptimizationResult | null;
  optimizedResumeUrl: string | null;
  isConnected: boolean;
  setJobId: (jobId: string | null) => void;
}

/**
 * Hook for managing optimization job status updates via polling.
 */
export function useResumeOptimizationPolling({
  jobId,
  analysisId,
  onComplete,
  onError,
  onProgress,
}: UseOptimizationStatusOptions): UseOptimizationStatusReturn {
  const [currentJobId, setCurrentJobId] = useState<string | null>(jobId);
  const [status, setStatus] = useState<"idle" | "starting" | "running" | "complete" | "failed">(
    "idle"
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [optimizedResumeUrl, setOptimizedResumeUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentJobId(jobId);
  }, [jobId]);

  const extractOptimizedUrl = useCallback((optimizationResult: OptimizationResult | any) => {
    return (
      optimizationResult?.optimized_resume?.file_url ||
      optimizationResult?.optimized_resume?.url ||
      optimizationResult?.optimized_resume?.pdf_url ||
      optimizationResult?.analysis?.optimized_file_url ||
      optimizationResult?.pdf_url ||
      null
    );
  }, []);

  const fetchOptimizedUrl = useCallback(async (analysisId: string) => {
    try {
      const response = await AnalysisService.getAnalysis(analysisId);
      const data: any = (response as any).data || response;

      const url =
        data?.optimized_resume?.file_url ??
        data?.optimized_resume?.url ??
        data?.optimized_resume?.pdf_url ??
        (data?.analysis && typeof data.analysis === "object"
          ? (data.analysis as any).optimized_file_url
          : undefined) ??
        data?.resume?.optimized_file_url ??
        null;

      if (url) setOptimizedResumeUrl(url);
    } catch {
      // Non-critical
    }
  }, []);

  const fetchCompleteOptimizationData = useCallback(async (analysisId: string) => {
    const response = await AnalysisService.getAnalysis(analysisId);
    const fullData: any = (response as any).data || response;
    const data: any = fullData?.data || fullData;

    const atsScoreBefore =
      data?.analysis?.ats_score_before ??
      data?.ats_analysis?.before?.score ??
      0;

    const atsScoreAfter =
      data?.analysis?.ats_score_after ??
      data?.ats_analysis?.after?.score ??
      null;

    const optimizedResult = {
      analysis: {
        id: data?.analysis?.id || "",
        resume_id: data?.analysis?.resume_id || "",
        ats_score_before: atsScoreBefore,
        ats_score_after: atsScoreAfter ?? null,
        score_improvement:
          atsScoreAfter !== null && atsScoreBefore !== null ? atsScoreAfter - atsScoreBefore : 0,
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
    } as any as OptimizationResult;

    const optimizedResumeUrl =
      (optimizedResult as any)?.optimized_resume?.file_url ||
      (optimizedResult as any)?.optimized_resume?.url ||
      (optimizedResult as any)?.optimized_resume?.pdf_url ||
      (data?.analysis as any)?.optimized_file_url ||
      null;

    return {
      optimizedResult,
      optimizedResumeUrl,
      atsScoreBefore,
      atsScoreAfter,
      hasOptimizedPdf: !!optimizedResumeUrl,
    };
  }, []);

  // Check optimization status via analysis endpoint when jobId is missing
  const checkAnalysisStatus = useCallback(async () => {
    if (!analysisId) return null;

    try {
      const completeData = await fetchCompleteOptimizationData(analysisId);
      
      // Check if optimization is complete (has ats_score_after)
      const isComplete = completeData.atsScoreAfter !== null && completeData.atsScoreAfter !== undefined;
      const hasOptimizedResume = !!completeData.optimizedResumeUrl || !!completeData.hasOptimizedPdf;
      
      if (isComplete || hasOptimizedResume) {
        return {
          isComplete: true,
          data: completeData,
        };
      }
      
      // Check if optimization is in progress (has analysis but no after score)
      // This means optimization was started but not finished
      const hasAnalysis = !!completeData.optimizedResult?.analysis?.id;
      if (hasAnalysis && !isComplete) {
        return {
          isComplete: false,
          isInProgress: true,
          data: completeData,
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }, [analysisId, fetchCompleteOptimizationData]);

  useEffect(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }

    let stopped = false;

    const mapStatus = (
      s: "optimization_pending" | "optimization_processing" | "optimization_completed" | "optimization_failed"
    ): "idle" | "starting" | "running" | "complete" | "failed" => {
      if (s === "optimization_pending") return "starting";
      if (s === "optimization_processing") return "running";
      if (s === "optimization_completed") return "complete";
      return "failed";
    };

    // If we have jobId, use the normal polling mechanism
    if (currentJobId) {
      setIsConnected(true);

      const tick = async () => {
        if (stopped) return;
        try {
          const job = await OptimizationService.getJobStatus(currentJobId);

          const nextStatus = mapStatus(job.status);
          const nextProgress = job.progress || 0;

          setStatus(nextStatus);
          setProgress(nextProgress);
          if (onProgress) onProgress(nextProgress);

          if (job.status === "optimization_failed") {
            const errMsg = job.error || "Optimization failed";
            trackOptimizationFailed(analysisId, errMsg);
            setError(errMsg);
            setStatus("failed");
            if (onError) onError(errMsg);
            return;
          }

          if (job.status === "optimization_completed") {
            const optimizationResult = (job.result || null) as OptimizationResult | null;
            if (optimizationResult) {
              setResult(optimizationResult);
              const resumeUrl = extractOptimizedUrl(optimizationResult);
              if (resumeUrl) setOptimizedResumeUrl(resumeUrl);
            }

            setStatus("complete");

            const tokenUsage = (job as any).token_usage || (optimizationResult as any)?.token_usage;

            setTimeout(async () => {
              if (stopped) return;
              try {
                const completeData = await fetchCompleteOptimizationData(analysisId);

                if (completeData.optimizedResumeUrl) {
                  setOptimizedResumeUrl(completeData.optimizedResumeUrl);
                }

                if (completeData.atsScoreAfter !== null) {
                  const mergedResult: OptimizationResult = {
                    ...completeData.optimizedResult,
                    final_audit:
                      completeData.optimizedResult.final_audit ||
                      (optimizationResult ? optimizationResult.final_audit : (undefined as any)),
                    optimized_resume:
                      completeData.optimizedResult.optimized_resume ||
                      (optimizationResult ? optimizationResult.optimized_resume : (undefined as any)),
                  };

                  setResult(mergedResult);

                  const scoreBefore = completeData.atsScoreBefore;
                  const scoreAfter = completeData.atsScoreAfter;
                  const scoreImprovement = scoreAfter - scoreBefore;

                  trackOptimizationComplete(
                    analysisId,
                    scoreImprovement,
                    scoreBefore,
                    scoreAfter,
                    tokenUsage
                  );
                  trackConversion("optimization");

                  if (onComplete) onComplete(mergedResult);
                } else if (optimizationResult?.analysis) {
                  const scoreBefore = optimizationResult.analysis.ats_score_before;
                  const scoreAfter = optimizationResult.analysis.ats_score_after;
                  const scoreImprovement = optimizationResult.analysis.score_improvement;

                  trackOptimizationComplete(
                    analysisId,
                    scoreImprovement,
                    scoreBefore,
                    scoreAfter,
                    tokenUsage
                  );
                  trackConversion("optimization");

                  if (onComplete) onComplete(optimizationResult);
                } else if (onComplete && optimizationResult) {
                  onComplete(optimizationResult);
                }
              } catch {
                if (optimizationResult?.analysis) {
                  const scoreBefore = optimizationResult.analysis.ats_score_before;
                  const scoreAfter = optimizationResult.analysis.ats_score_after;
                  const scoreImprovement = optimizationResult.analysis.score_improvement;

                  trackOptimizationComplete(
                    analysisId,
                    scoreImprovement,
                    scoreBefore,
                    scoreAfter,
                    tokenUsage
                  );
                  trackConversion("optimization");
                }
                if (onComplete && optimizationResult) onComplete(optimizationResult);
              }
            }, 1500);

            return;
          }

          pollTimeoutRef.current = setTimeout(tick, 2000);
        } catch (e: any) {
          const msg = e?.message || String(e);
          setError(msg);
          setStatus("failed");
          if (onError) onError(msg);
        }
      };

      tick();

      return () => {
        stopped = true;
        if (pollTimeoutRef.current) {
          clearTimeout(pollTimeoutRef.current);
          pollTimeoutRef.current = null;
        }
      };
    }
    
    // If no jobId but we have analysisId, check analysis status periodically
    // This handles page refresh scenarios where jobId is lost
    if (!currentJobId && analysisId) {
      setIsConnected(true);
      setStatus("running");
      setProgress(0);

      const checkStatus = async () => {
        if (stopped) return;
        try {
          const statusCheck = await checkAnalysisStatus();
          
          if (statusCheck?.isComplete) {
            // Optimization is complete
            const completeData = statusCheck.data;
            setStatus("complete");
            setProgress(100);
            if (onProgress) onProgress(100);
            
            if (completeData.optimizedResumeUrl) {
              setOptimizedResumeUrl(completeData.optimizedResumeUrl);
            }
            
            setResult(completeData.optimizedResult);
            
            const scoreBefore = completeData.atsScoreBefore;
            const scoreAfter = completeData.atsScoreAfter;
            if (scoreAfter !== null) {
              const scoreImprovement = scoreAfter - scoreBefore;
              trackOptimizationComplete(
                analysisId,
                scoreImprovement,
                scoreBefore,
                scoreAfter,
                undefined
              );
              trackConversion("optimization");
            }
            
            if (onComplete) onComplete(completeData.optimizedResult);
            return;
          } else if (statusCheck?.isInProgress) {
            // Optimization is still in progress, continue checking
            // Increment progress slightly to show activity (but cap at 90)
            setProgress((prevProgress) => {
              const newProgress = Math.min(prevProgress + 1, 90);
              if (onProgress) onProgress(newProgress);
              return newProgress;
            });
            
            pollTimeoutRef.current = setTimeout(checkStatus, 3000);
          } else {
            // No optimization found or status unclear, continue checking
            pollTimeoutRef.current = setTimeout(checkStatus, 3000);
          }
        } catch (e: any) {
          // Continue checking even on error (might be transient)
          pollTimeoutRef.current = setTimeout(checkStatus, 3000);
        }
      };

      // Initial check
      checkStatus();

      return () => {
        stopped = true;
        if (pollTimeoutRef.current) {
          clearTimeout(pollTimeoutRef.current);
          pollTimeoutRef.current = null;
        }
      };
    }

    // No jobId and no analysisId - idle state
    if (!currentJobId && !analysisId) {
      setIsConnected(false);
      setStatus("idle");
      setProgress(0);
    }

    return () => {
      stopped = true;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, [
    currentJobId,
    analysisId,
    onComplete,
    onError,
    onProgress,
    extractOptimizedUrl,
    fetchCompleteOptimizationData,
    checkAnalysisStatus,
  ]);

  useEffect(() => {
    if (status === "complete" && analysisId && !optimizedResumeUrl && result) {
      fetchOptimizedUrl(analysisId);
    }
  }, [status, analysisId, optimizedResumeUrl, result, fetchOptimizedUrl]);

  const setJobId = useCallback((newJobId: string | null) => {
    setCurrentJobId(newJobId);
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


