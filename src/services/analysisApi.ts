/**
 * @deprecated This file is kept for backward compatibility.
 * Please use the modular exports from './analysis' instead.
 * 
 * Example:
 * import { AnalysisService, OptimizationService, DownloadService } from './analysis';
 * 
 * Or use the combined service:
 * import AnalysisApiService from './analysis';
 */

// Re-export everything from the modular analysis service
export * from './analysis';
export { AnalysisApiService as default } from './analysis';
