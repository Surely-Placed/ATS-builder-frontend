import { useState, useCallback } from "react";
import { OptimizationService, AnalysisService, DownloadService } from "@/features/analysis/services";
import { useResumeOptimizationPolling, UseOptimizationStatusOptions } from "./useResumeOptimizationPolling";
import { OptimizationResult } from "@/features/analysis/services/types";

export interface UseResumeOptimizationOptions extends Omit<UseOptimizationStatusOptions, "jobId"> {
    // Add any extra options if needed
}

export interface UseResumeOptimizationReturn {
    status: "idle" | "starting" | "running" | "complete" | "failed";
    progress: number;
    result: OptimizationResult | null;
    error: string | null;
    optimizedResumeUrl: string | null;
    isConnected: boolean;

    startOptimization: () => Promise<void>;
    fetchAnalysis: () => Promise<any>;
    downloadResume: () => void;
    cancelOptimization: () => void;
}

export function useResumeOptimization({
    analysisId,
    onComplete,
    onError,
    onProgress
}: UseResumeOptimizationOptions): UseResumeOptimizationReturn {
    const [jobId, setJobId] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);

    // Use the polling hook
    const polling = useResumeOptimizationPolling({
        jobId,
        analysisId,
        onComplete,
        onError,
        onProgress
    });

    const startOptimization = useCallback(async () => {
        if (!analysisId) throw new Error("Analysis ID is required");

        try {
            setIsStarting(true);
            const response = await OptimizationService.startOptimization(analysisId);
            if (response.jobId) {
                setJobId(response.jobId);
                polling.setJobId(response.jobId);
            }
        } catch (err: any) {
            const msg = err.message || "Failed to start optimization";
            if (onError) onError(msg);
            throw err;
        } finally {
            setIsStarting(false);
        }
    }, [analysisId, onError, polling]);

    const fetchAnalysis = useCallback(async () => {
        if (!analysisId) return null;
        try {
            const response = await AnalysisService.getAnalysis(analysisId);
            return (response as any).data || response;
        } catch (err) {
            console.error("Failed to fetch analysis:", err);
            throw err;
        }
    }, [analysisId]);

    const downloadResume = useCallback(() => {
        if (!analysisId) return;
        const url = polling.optimizedResumeUrl;
        if (url) {
            DownloadService.downloadResume(url, "optimized-resume.pdf", analysisId);
        }
    }, [analysisId, polling.optimizedResumeUrl]);

    const cancelOptimization = useCallback(() => {
        setJobId(null);
        polling.setJobId(null);
        // Cancellation API not implemented yet on backend for this flow usually
    }, [polling]);

    return {
        status: isStarting ? "starting" : polling.status,
        progress: polling.progress,
        result: polling.result,
        error: polling.error,
        optimizedResumeUrl: polling.optimizedResumeUrl,
        isConnected: polling.isConnected,
        startOptimization,
        fetchAnalysis,
        downloadResume,
        cancelOptimization
    };
}
