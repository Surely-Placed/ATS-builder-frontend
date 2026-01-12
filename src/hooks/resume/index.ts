/**
 * Resume-related hooks - Modular exports
 */

export { useResumeOptimization } from "./useResumeOptimization";
export { useSafePolling } from "../useSafePolling";
export { useAnalysisPolling } from "../useAnalysisPolling";
export { useResumeDownload } from "./useResumeDownload";

export type {
  UseResumeOptimizationOptions,
  UseResumeOptimizationReturn,
} from "./useResumeOptimization";

export type { UseSafePollingOptions, UseSafePollingReturn } from "../useSafePolling";

export type { UseAnalysisPollingReturn } from "../useAnalysisPolling";


export type { UseResumeDownloadOptions, UseResumeDownloadReturn } from "./useResumeDownload";
