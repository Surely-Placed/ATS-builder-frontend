import React from "react";
import type { ResumeQualityScore, ComprehensiveFeedback } from "../../services/analysis/types";
import { ComprehensiveScoreCard } from "./ComprehensiveScoreCard";
import { QualityScoreDetails } from "./QualityScoreDetails";
import { ScoreBreakdown } from "./ScoreBreakdown";

interface ResumeQualityFeedbackProps {
  qualityScore: ResumeQualityScore | null;
  comprehensiveFeedback: ComprehensiveFeedback | null;
  atsScore?: number;
}

export const ResumeQualityFeedback: React.FC<ResumeQualityFeedbackProps> = ({
  qualityScore,
  comprehensiveFeedback,
  atsScore,
}) => {
  return (
    <div className="w-full space-y-6">
      <ComprehensiveScoreCard 
        comprehensiveFeedback={comprehensiveFeedback} 
      />

      <QualityScoreDetails 
        qualityScore={qualityScore} 
      />

      <ScoreBreakdown
        comprehensiveFeedback={comprehensiveFeedback}
        qualityScore={qualityScore}
        atsScore={atsScore}
      />
    </div>
  );
};
