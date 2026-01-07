import { AnalysisResult, OptimizationResult } from "@/services/analysisApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, TrendingUp, AlertCircle, Eye, Loader2 } from "lucide-react";
import { getDisplayScores, formatScore, formatImprovement } from "@/utils/scoreUtils";
import "./ComparisonView.css";

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
  // Use display scores from original analysis (before optimization)
  const { scoreBefore } = getDisplayScores(originalAnalysis);

  // Use display scores from optimized result (after optimization)
  const { scoreAfter, improvement } = getDisplayScores(optimizedResult);

  const finalAudit = optimizedResult.final_audit;
  const improvementsMade = finalAudit?.improvements_made ?? [];
  const finalRecommendations = finalAudit?.final_recommendations ?? [];
  const qualityScore =
    finalAudit?.quality_score != null ? finalAudit.quality_score : (scoreAfter ?? null);

  return (
    <div className="comparison-view">
      <div className="comparison-header">
        <h1>Optimization Complete! 🎉</h1>
        <Button onClick={onStartNew} variant="outline">
          ← Analyze Another Resume
        </Button>
      </div>

      {/* Score Comparison */}
      <Card className="score-comparison">
        <CardContent className="pt-6">
          <div className="score-comparison-grid">
            <div className="score-card before">
              <h3>Before Optimization</h3>
              <div className="score-value">{scoreBefore}</div>
              <div className="score-label">ATS Score</div>
            </div>

            <div className="score-arrow">
              <TrendingUp className="w-8 h-8" />
            </div>

            <div className="score-card after">
              <h3>After Optimization</h3>
              <div className="score-value">{scoreAfter ?? "N/A"}</div>
              <div className="score-label">ATS Score</div>
              {improvement !== null && (
                <div className="score-improvement">
                  {formatImprovement(improvement)} points improvement
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Improvements Made */}
      {improvementsMade.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Improvements Made</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="improvements-list">
              {improvementsMade.map((text, idx) => (
                <li key={`${idx}-${text}`} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Final Audit */}
      {finalAudit && (
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
                  ✅ Yes
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
      )}

      {/* Preview and Download Buttons */}
      <Card className="download-section">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              {onPreview && (
                <Button
                  onClick={onPreview}
                  size="lg"
                  variant="outline"
                  className="btn-preview"
                  disabled={isPreviewLoading}
                >
                  {isPreviewLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Loading Preview...
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5 mr-2" />
                      Preview Changes
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={onDownload}
                size="lg"
                className="btn-download"
                disabled={isDownloadLoading}
              >
                {isDownloadLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Optimized Resume PDF
                  </>
                )}
              </Button>
            </div>
            <p className="download-note">
              Your optimized resume is ready! Preview the changes or download the PDF for your job
              applications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonView;
