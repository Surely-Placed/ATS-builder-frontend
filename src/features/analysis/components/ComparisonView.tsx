import { AnalysisResult, OptimizationResult } from "@/features/analysis/services/types";
import { Button } from "@/components/ui/button";
import React from "react";
import "./ComparisonView.css";
import { ScoreComparisonCard } from "./ScoreComparisonCard";
import { ImprovementsList } from "./ImprovementsList";
import { FinalAuditCard } from "./FinalAuditCard";
import { DownloadSection } from "./DownloadSection";
import { AIInsights } from "@/features/resume/components/AIInsights";
import { ResumeQualityFeedback } from "./ResumeQualityFeedback";
import { getDisplayScores } from "@/utils/scoreUtils";

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

  // Extract analysis data for display
  const { scoreBefore } = getDisplayScores(originalAnalysis);
  const strengths = originalAnalysis?.ats_analysis?.ai_insights?.strengths || [];
  const weaknesses = originalAnalysis?.ats_analysis?.ai_insights?.weaknesses || [];
  const recommendations = originalAnalysis?.ats_analysis?.ai_insights?.recommendations || [];
  const resumeQuality = originalAnalysis?.resume_quality;
  const comprehensiveFeedback = originalAnalysis?.comprehensive_feedback;
  const hasAtsAnalysis = !!originalAnalysis?.ats_analysis;

  return (
    <div className="comparison-view w-full px-2 sm:px-4 md:px-0">
      <div className="comparison-header flex flex-col sm:flex-row gap-3 sm:gap-0">
        <h1 className="text-lg sm:text-xl md:text-2xl">Optimization Complete! 🎉</h1>
        <Button onClick={onStartNew} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
          ← Analyze Another Resume
        </Button>
      </div>

      {/* Analysis Results Section - Show original analysis insights */}
      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold mt-6 mb-4">Initial Analysis Results</h2>
        
        <ResumeQualityFeedback
          qualityScore={resumeQuality || null}
          comprehensiveFeedback={comprehensiveFeedback || null}
          atsScore={scoreBefore}
        />

        {hasAtsAnalysis && (
          <AIInsights
            strengths={strengths}
            weaknesses={weaknesses}
            recommendations={recommendations}
          />
        )}
      </div>

      {/* Comparison Section */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Before vs After Comparison</h2>
      
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
