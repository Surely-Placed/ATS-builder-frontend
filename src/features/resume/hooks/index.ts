/**
 * Resume-related hooks - Modular exports
 */

export { useResumeOptimization } from "./useResumeOptimization";
export { useAnalysisPolling } from "@/features/analysis/hooks/useAnalysisPolling";
export * from "./useResumeOptimizationPolling";
export { useResumeDownload } from "./useResumeDownload";

export type {
  UseResumeOptimizationOptions,
  UseResumeOptimizationReturn,
} from "./useResumeOptimization";

export type { UseAnalysisPollingReturn } from "@/features/analysis/hooks/useAnalysisPolling";


export type { UseResumeDownloadOptions, UseResumeDownloadReturn } from "./useResumeDownload";
