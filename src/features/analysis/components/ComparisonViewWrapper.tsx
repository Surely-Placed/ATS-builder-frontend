import React, { useEffect } from "react";
import ComparisonView from "./ComparisonView";
import { AnalysisResult, OptimizationResult } from "@/features/analysis/services/types";

interface ComparisonViewWrapperProps {
  analysisResult: AnalysisResult | null;
  optimizationResult: OptimizationResult | null;
  handleDownload: () => void;
  handleStartNew: () => void;
  handlePreview: () => void;
  isDownloading: boolean;
}

export const ComparisonViewWrapper: React.FC<ComparisonViewWrapperProps> = ({
  analysisResult,
  optimizationResult,
  handleDownload,
  handleStartNew,
  handlePreview,
  isDownloading,
}) => {
  // If we have both analysis + optimization result, render comparison
  if (analysisResult && optimizationResult) {
    return (
      <ComparisonView
        originalAnalysis={analysisResult}
        optimizedResult={optimizationResult}
        onDownload={handleDownload}
        onStartNew={handleStartNew}
        onPreview={handlePreview}
        isPreviewLoading={false}
        isDownloadLoading={isDownloading}
      />
    );
  }

  // If optimization result is missing, treat this as a signal to clean up and
  // send the user back to the analysis form. This avoids showing a persistent
  // "Preparing comparison..." placeholder when the user clicks "Analyze Another".
  useEffect(() => {
    // Defensive: ensure we only call the cleanup if a handler is provided
    try {
      handleStartNew && handleStartNew();
    } catch (e) {
      // ignore
    }
    // We intentionally run this effect when the component mounts and when
    // optimizationResult changes to null/undefined.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimizationResult]);

  // Render nothing while navigation/cleanup happens
  return null;
};