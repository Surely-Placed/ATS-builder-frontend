/**
 * Analysis API Service - Modular exports
 * 
 * This module provides a modular structure for analysis-related API operations:
 * - AnalysisService: Resume analysis operations
 * - OptimizationService: Resume optimization operations
 * - DownloadService: File download operations
 * - PreviewService: Preview and PDF generation operations
 */

// Re-export all types
export * from './types';

// Re-export all services
export { AnalysisService } from './analysisService';
export { OptimizationService } from './optimizationService';
export { DownloadService } from './downloadService';
export { PreviewService } from './previewService';

// Main service class that combines all services (for backward compatibility)
import { AnalysisService } from './analysisService';
import { OptimizationService } from './optimizationService';
import { DownloadService } from './downloadService';
import { PreviewService } from './previewService';
import type {
  StartAnalysisRequest,
  AnalysisResult,
  OptimizationJobResponse,
  JobStatusResponse,
  PreviewResponse,
} from './types';

export class AnalysisApiService {
  static analyzeResume = AnalysisService.analyzeResume;
  static getAnalysis = AnalysisService.getAnalysis;
  static startOptimization = OptimizationService.startOptimization;
  static getJobStatus = OptimizationService.getJobStatus;
  static downloadFile = DownloadService.downloadFile;
  static downloadResume = DownloadService.downloadResume;
  static getPreview = PreviewService.getPreview;
  static generatePDF = PreviewService.generatePDF;
}

export default AnalysisApiService;

