import React from "react";
import { Button } from "@/components/ui/button";
import { AnalysisResult } from "@/services/analysisApi";
import { getDisplayScores } from "@/utils/scoreUtils";
import { ResumeQualityFeedback } from "@/components/analysis/ResumeQualityFeedback";
import { ScoreCard } from "../ScoreCard";
import { BreakdownCards } from "../BreakdownCards";
import { AIInsights } from "../AIInsights";
import { OptimizeButton } from "../OptimizeButton";

interface ResumeAnalysisViewProps {
  analysisResult: AnalysisResult;
  isWebSocketConnected: boolean;
  onStartOptimization: () => void;
  onStartNew: () => void;
}

export const ResumeAnalysisView: React.FC<ResumeAnalysisViewProps> = ({
  analysisResult,
  isWebSocketConnected,
  onStartOptimization,
  onStartNew,
}) => {
  const { scoreBefore } = getDisplayScores(analysisResult);

  const breakdown = analysisResult?.ats_analysis?.before?.breakdown;
  const strengths = analysisResult?.ats_analysis?.ai_insights?.strengths || [];
  const weaknesses = analysisResult?.ats_analysis?.ai_insights?.weaknesses || [];
  const recommendations = analysisResult?.ats_analysis?.ai_insights?.recommendations || [];
  const resumeQuality = analysisResult?.resume_quality;
  const comprehensiveFeedback = analysisResult?.comprehensive_feedback;
  const hasAtsAnalysis = !!analysisResult?.ats_analysis;

  return (
    <div className="resume-analysis-flow">
      <div className="analysis-view">
        {/* Header */}
        <div className="view-header">
          <h1>Resume Analysis Complete</h1>
          <Button onClick={onStartNew} variant="outline">
            ← Start New Analysis
          </Button>
        </div>

        <ScoreCard score={scoreBefore} />

        {hasAtsAnalysis && <BreakdownCards breakdown={breakdown} />}

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
          isWebSocketConnected={isWebSocketConnected}
          onStartOptimization={onStartOptimization}
        />
      </div>
    </div>
  );
};
