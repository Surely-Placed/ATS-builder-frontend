/**
 * Resume-related hooks - Modular exports
 */

export { useResumeOptimization } from './useResumeOptimization';
export { useResumeOptimizationWebSocket } from './useResumeOptimizationWebSocket';
export { useResumeDownload } from './useResumeDownload';

export type {
  UseResumeOptimizationOptions,
  UseResumeOptimizationReturn,
} from './useResumeOptimization';

export type {
  UseWebSocketOptions,
  UseWebSocketReturn,
} from './useResumeOptimizationWebSocket';

export type {
  UseResumeDownloadOptions,
  UseResumeDownloadReturn,
} from './useResumeDownload';

