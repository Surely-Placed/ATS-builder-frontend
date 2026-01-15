import { AnalysisResult, OptimizationResult } from "@/services/analysisApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import "./ComparisonView.css";
import { ScoreComparisonCard } from "./ScoreComparisonCard";
import { ImprovementsList } from "./ImprovementsList";
import { FinalAuditCard } from "./FinalAuditCard";
import { DownloadSection } from "./DownloadSection";

interface ComparisonViewProps {
  originalAnalysis: AnalysisResult;
  optimizedResult: OptimizationResult;
  onDownload: () => void;
  onStartNew: () => void;
  onPreview?: () => void;
  isPreviewLoading?: boolean;
  isDownloadLoading?: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalAnalysis,
  optimizedResult,
  onDownload,
  onStartNew,
  onPreview,
  isPreviewLoading = false,
  isDownloadLoading = false,
}) => {
  // Final audit and derived lists
  const finalAudit = optimizedResult.final_audit;
  const improvementsMade = finalAudit?.improvements_made ?? [];

  // Debug logs removed

  return (
    <div className="comparison-view w-full px-2 sm:px-4 md:px-0">
      <div className="comparison-header flex flex-col sm:flex-row gap-3 sm:gap-0">
        <h1 className="text-lg sm:text-xl md:text-2xl">Optimization Complete! 🎉</h1>
        <Button onClick={onStartNew} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
          ← Analyze Another Resume
        </Button>
      </div>

      <ScoreComparisonCard 
        originalAnalysis={originalAnalysis}
        optimizedResult={optimizedResult}
      />

      <ImprovementsList improvements={improvementsMade} />

      <FinalAuditCard finalAudit={finalAudit} />

      <DownloadSection
        onDownload={onDownload}
        onStartNew={onStartNew}
        onPreview={onPreview}
        isPreviewLoading={isPreviewLoading}
        isDownloadLoading={isDownloadLoading}
      />
    </div>
  );
};

export default ComparisonView;
