import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatImprovement } from "@/utils/scoreUtils";
import { AnalysisResult, OptimizationResult } from "@/services/analysisApi";

interface ScoreComparisonCardProps {
  originalAnalysis: AnalysisResult;
  optimizedResult: OptimizationResult;
}

export const ScoreComparisonCard: React.FC<ScoreComparisonCardProps> = ({
  originalAnalysis,
  optimizedResult,
}) => {
  // Calculate improvement
  const calculateImprovement = () => {
    const beforeVal = originalAnalysis?.ats_analysis?.before?.display_score ?? 
                     originalAnalysis?.analysis?.ats_score_before ?? 
                     originalAnalysis?.atsScoreBefore ?? null;
    
    const afterVal = optimizedResult?.ats_analysis?.after?.display_score ?? 
                    optimizedResult?.analysis?.ats_score_after ?? 
                    optimizedResult?.atsScoreAfter ?? null;
    
    const beforeNum = beforeVal !== null ? Number(beforeVal) : null;
    const afterNum = afterVal !== null ? Number(afterVal) : null;
    
    if (afterNum !== null && !isNaN(afterNum) && beforeNum !== null && !isNaN(beforeNum)) {
      return afterNum - beforeNum;
    }
    return null;
  };

  const improvementVal = calculateImprovement();
  const improvementText = improvementVal !== null ? formatImprovement(improvementVal) : null;
  const improvementColor = improvementVal !== null 
    ? (improvementVal > 0 ? 'text-green-600' : improvementVal < 0 ? 'text-red-600' : 'text-gray-600')
    : '';

  return (
    <Card className="score-comparison">
      <CardContent className="pt-6">
        <div className="score-comparison-grid">
          <div className="score-card before">
            <h3>Before Optimization</h3>
            <div className="score-value">
              {String(
                originalAnalysis?.ats_analysis?.before?.display_score ??
                originalAnalysis?.analysis?.ats_score_before ??
                originalAnalysis?.atsScoreBefore ??
                "—"
              )}
            </div>
            <div className="score-label">ATS Score</div>
          </div>

          <div className="score-arrow">
            <TrendingUp className="w-8 h-8" />
          </div>

          <div className="score-card after">
            <h3>After Optimization</h3>
            <div className="score-value">
              {String(
                optimizedResult?.ats_analysis?.after?.display_score ??
                optimizedResult?.analysis?.ats_score_after ??
                optimizedResult?.atsScoreAfter ??
                "—"
              )}
            </div>
            <div className="score-label">ATS Score</div>
            {improvementText && (
              <div className={`score-improvement ${improvementColor}`}>
                {improvementText} points improvement
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};