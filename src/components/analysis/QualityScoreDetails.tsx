import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ResumeQualityScore } from "../../services/analysis/types";
import { getScoreColorClass, getLevelBadgeClass } from "@/utils/scoreUtils";

interface QualityScoreDetailsProps {
  qualityScore: ResumeQualityScore | null;
}

export const QualityScoreDetails: React.FC<QualityScoreDetailsProps> = ({
  qualityScore,
}) => {
  if (!qualityScore) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Resume Quality Analysis</CardTitle>
            <Badge className="bg-muted text-muted-foreground">Not Available</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Resume quality analysis data is not available for this analysis.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Resume Quality Analysis</CardTitle>
          <Badge className={getLevelBadgeClass(qualityScore.level)}>{qualityScore.level}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-center mb-4">
            <div className={`text-5xl font-bold ${getScoreColorClass(qualityScore.score)}`}>
              {qualityScore.score}
            </div>
            <span className="text-muted-foreground ml-2">/ 100</span>
          </div>
          <Progress value={qualityScore.score} className="h-3" />
        </div>

        {/* Strengths */}
        {qualityScore.strengths.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>✅</span> Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {qualityScore.strengths.map((strength, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                >
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {qualityScore.issues.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span> Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {qualityScore.issues.map((issue, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20"
                >
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span className="text-sm">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {qualityScore.issues.length === 0 && qualityScore.strengths.length > 0 && (
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
            <p className="text-green-700 dark:text-green-400 font-medium flex items-center justify-center gap-2">
              <span>🎉</span> Your resume has excellent quality!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};