import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { ResumeQualityScore, ComprehensiveFeedback } from '../../services/analysis/types';

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
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 40) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
      'Excellent': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      'Good': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      'Average': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      'Needs Improvement': 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      'Strong': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    };
    return styles[level] || 'bg-muted text-muted-foreground';
  };

  // Always render, even if data is missing (show placeholders)
  return (
    <div className="w-full space-y-6">
      {/* Comprehensive Score Card - Always show */}
      {comprehensiveFeedback ? (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Overall Resume Score</CardTitle>
              <Badge className={getLevelBadge(comprehensiveFeedback.level)}>
                {comprehensiveFeedback.level}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              {/* Overall Score */}
              <div className="flex-1 text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(comprehensiveFeedback.overall_score)}`}>
                  {comprehensiveFeedback.overall_score}
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>

              {/* Score Breakdown */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{comprehensiveFeedback.ats_score}</div>
                  <div className="text-xs text-muted-foreground mt-1">ATS Score</div>
                  <div className="text-xs text-muted-foreground">Job Match</div>
                </div>
                {comprehensiveFeedback.quality_score !== null && (
                  <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{comprehensiveFeedback.quality_score}</div>
                    <div className="text-xs text-muted-foreground mt-1">Quality Score</div>
                    <div className="text-xs text-muted-foreground">Structure</div>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Messages */}
            <div className="space-y-3">
              <div className={`p-4 rounded-lg border ${getScoreBg(comprehensiveFeedback.ats_score)}`}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span>📊</span> ATS Feedback
                </h3>
                <p className="text-sm">{comprehensiveFeedback.feedback.ats_feedback}</p>
              </div>
              
              {comprehensiveFeedback.quality_score !== null && (
                <div className={`p-4 rounded-lg border ${getScoreBg(comprehensiveFeedback.quality_score)}`}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span>✨</span> Quality Feedback
                  </h3>
                  <p className="text-sm">{comprehensiveFeedback.feedback.quality_feedback}</p>
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
      ) : (
        // Placeholder when comprehensive_feedback is missing
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Overall Resume Score</CardTitle>
              <Badge className="bg-muted text-muted-foreground">Not Available</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Comprehensive feedback data is not available for this analysis.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quality Score Details - Always show */}
      {qualityScore ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Resume Quality Analysis</CardTitle>
              <Badge className={getLevelBadge(qualityScore.level)}>
                {qualityScore.level}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className={`text-5xl font-bold ${getScoreColor(qualityScore.score)}`}>
                  {qualityScore.score}
                </div>
                <span className="text-muted-foreground ml-2">/ 100</span>
              </div>
              <Progress 
                value={qualityScore.score} 
                className="h-3"
              />
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
                    <li key={idx} className="flex items-start gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
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
      ) : (
        // Placeholder when resume_quality is missing
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Resume Quality Analysis</CardTitle>
              <Badge className="bg-muted text-muted-foreground">Not Available</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Resume quality analysis data is not available for this analysis.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score Breakdown - Always show */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ATS Score */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {comprehensiveFeedback?.ats_score ?? atsScore ?? 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">ATS Score</div>
              <div className="text-xs text-muted-foreground">Job-specific match</div>
            </div>
            {/* Quality Score */}
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {qualityScore?.score ?? 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Quality Score</div>
              <div className="text-xs text-muted-foreground">Structure & content</div>
            </div>
            {/* Overall Score */}
            <div className="text-center p-4 border-2 border-primary rounded-lg bg-primary/5">
              <div className={`text-2xl font-bold ${comprehensiveFeedback?.overall_score ? getScoreColor(comprehensiveFeedback.overall_score) : 'text-muted-foreground'}`}>
                {comprehensiveFeedback?.overall_score ?? 'N/A'}
              </div>
              <div className="text-sm font-semibold mt-1">Overall Score</div>
              <div className="text-xs text-muted-foreground">Combined assessment</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

