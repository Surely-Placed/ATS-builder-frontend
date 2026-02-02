import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { renderField } from "@/utils/analysis/renderField";
import type { ComprehensiveFeedback } from '@/features/analysis/services/types';
import { getScoreColorClass, getScoreBgClass, getLevelBadgeClass } from "@/utils/scoreUtils";

interface ComprehensiveScoreCardProps {
  comprehensiveFeedback: ComprehensiveFeedback | null;
}

export const ComprehensiveScoreCard: React.FC<ComprehensiveScoreCardProps> = ({
  comprehensiveFeedback,
}) => {
  if (!comprehensiveFeedback) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Overall Resume Score</CardTitle>
            <Badge className="bg-muted text-muted-foreground">Not Available</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Comprehensive feedback data is not available for this analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Overall Resume Score</CardTitle>
          <Badge className={getLevelBadgeClass(comprehensiveFeedback.level)}>
            {comprehensiveFeedback.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          {/* Overall Score */}
          <div className="flex-1 text-center">
            <div
              className={`text-6xl font-bold mb-2 ${getScoreColorClass(comprehensiveFeedback.overall_score)}`}
            >
              {comprehensiveFeedback.overall_score}
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>

          {/* Score Breakdown */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {comprehensiveFeedback.ats_score}
              </div>
              <div className="text-xs text-muted-foreground mt-1">ATS Score</div>
              <div className="text-xs text-muted-foreground">Job Match</div>
            </div>
            {comprehensiveFeedback.quality_score !== null && (
              <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {comprehensiveFeedback.quality_score}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Quality Score</div>
                <div className="text-xs text-muted-foreground">Structure</div>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
        <div className="space-y-3">
          <div
            className={`p-4 rounded-lg border ${getScoreBgClass(comprehensiveFeedback.ats_score)}`}
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span>📊</span> ATS Feedback
            </h3>
            <p className="text-sm">{renderField(comprehensiveFeedback.feedback.ats_feedback, "ATS Feedback")}</p>
          </div>

          {comprehensiveFeedback.quality_score !== null && (
            <div
              className={`p-4 rounded-lg border ${getScoreBgClass(comprehensiveFeedback.quality_score)}`}
            >
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span>✨</span> Quality Feedback
              </h3>
              <p className="text-sm">{renderField(comprehensiveFeedback.feedback.quality_feedback, "Quality Feedback")}</p>
            </div>
          )}

          {/* Recommendations */}
          {comprehensiveFeedback.feedback.combined_recommendations.length > 0 && (
            <div className="p-4 bg-muted rounded-lg border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>💡</span> Recommendations
              </h3>
              <ul className="space-y-2">
                {comprehensiveFeedback.feedback.combined_recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};