import React from "react";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/features/analysis/services/types";
import { getDisplayScores } from "@/utils/scoreUtils";
import { ResumeQualityFeedback } from "@/features/analysis/components/ResumeQualityFeedback";
import { ScoreCard } from "./ScoreCard";
import { AIInsights } from "./AIInsights";
import { OptimizeButton } from "./OptimizeButton";

interface ResumeAnalysisViewProps {
  analysisResult: AnalysisResult;
  isStatusUpdatesConnected: boolean;
  onStartOptimization: () => void;
  onStartNew: () => void;
  isOptimizing?: boolean;
}

export const ResumeAnalysisView: React.FC<ResumeAnalysisViewProps> = ({
  analysisResult,
  isStatusUpdatesConnected,
  onStartOptimization,
  onStartNew,
  isOptimizing,
}) => {
  const { scoreBefore } = getDisplayScores(analysisResult);

  const strengths = analysisResult?.ats_analysis?.ai_insights?.strengths || [];
  const weaknesses = analysisResult?.ats_analysis?.ai_insights?.weaknesses || [];
  const recommendations = analysisResult?.ats_analysis?.ai_insights?.recommendations || [];
  const resumeQuality = analysisResult?.resume_quality;
  const comprehensiveFeedback = analysisResult?.comprehensive_feedback;
  const hasAtsAnalysis = !!analysisResult?.ats_analysis;

  return (
    <div className="resume-analysis-flow w-full px-2 sm:px-4 md:px-0">
      <div className="analysis-view w-full">
        {/* Header */}
        <div className="view-header flex flex-col sm:flex-row gap-3 sm:gap-0">
          <h1 className="text-lg sm:text-xl md:text-2xl">Resume Analysis Complete</h1>
          <Button onClick={onStartNew} variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
            ← Start New Analysis
          </Button>
        </div>

        <ScoreCard score={scoreBefore} />

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

        <OptimizeButton
          onStartOptimization={onStartOptimization}
          isOptimizing={isOptimizing}
        />
      </div>
    </div>
  );
};
