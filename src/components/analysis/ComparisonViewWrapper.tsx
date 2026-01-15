import ComparisonView from "./ComparisonView";
import { AnalysisResult, OptimizationResult } from "@/services/analysisApi";

interface ComparisonViewWrapperProps {
  analysisResult: AnalysisResult;
  optimizationResult: OptimizationResult;
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

  // If comparison state requested but optimization result isn't available yet,
  // show a persistent placeholder/loading state instead of falling back to the form.
  return (
    <div className="optimizing-placeholder w-full flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <div className="loader mb-4" aria-hidden />
        <h2 className="text-lg font-medium">Preparing comparison...</h2>
        <p className="text-sm text-muted-foreground mt-2">Finishing up optimization — this may take a few seconds.</p>
      </div>
    </div>
  );
};