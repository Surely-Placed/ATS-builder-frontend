import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { formatScore } from "@/utils/scoreUtils";
import { OptimizationResult } from "@/features/analysis/services/types";

interface FinalAuditCardProps {
  finalAudit: OptimizationResult['final_audit'];
}

export const FinalAuditCard: React.FC<FinalAuditCardProps> = ({ finalAudit }) => {
  if (!finalAudit) {
    return null;
  }

  const qualityScore = finalAudit?.quality_score != null
    ? finalAudit.quality_score
    : null;

  const finalRecommendations = finalAudit?.final_recommendations ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Quality Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="audit-grid">
          <div className="audit-item">
            <strong>Quality Score:</strong> {formatScore(qualityScore)}
          </div>
          <div className="audit-item">
            <strong>Ready for Submission:</strong>{" "}
            <Badge variant="default" className="bg-green-500">
               Yes
            </Badge>
          </div>
        </div>

        {finalRecommendations.length > 0 && (
          <div className="final-recommendations">
            <h3>Final Recommendations</h3>
            <ul className="space-y-2">
              {finalRecommendations.map((text, idx) => (
                <li key={`${idx}-${text}`} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};