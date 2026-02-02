import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreColor } from "@/utils/scoreUtils";
import type { ComprehensiveFeedback } from '@/features/analysis/services/types';
import type { ResumeQualityScore } from '@/features/analysis/services/types';

interface ScoreBreakdownProps {
  comprehensiveFeedback: ComprehensiveFeedback | null;
  qualityScore: ResumeQualityScore | null;
  atsScore?: number;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  comprehensiveFeedback,
  qualityScore,
  atsScore,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ATS Score */}
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {comprehensiveFeedback?.ats_score ?? atsScore ?? "N/A"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">ATS Score</div>
            <div className="text-xs text-muted-foreground">Job-specific match</div>
          </div>
          {/* Quality Score */}
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {qualityScore?.score ?? "N/A"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Quality Score</div>
            <div className="text-xs text-muted-foreground">Structure & content</div>
          </div>
          {/* Overall Score */}
          <div className="text-center p-4 border-2 border-primary rounded-lg bg-primary/5">
            <div
              className={`text-2xl font-bold ${comprehensiveFeedback?.overall_score ? getScoreColor(comprehensiveFeedback.overall_score) : "text-muted-foreground"}`}
            >
              {comprehensiveFeedback?.overall_score ?? "N/A"}
            </div>
            <div className="text-sm font-semibold mt-1">Overall Score</div>
            <div className="text-xs text-muted-foreground">Combined assessment</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};