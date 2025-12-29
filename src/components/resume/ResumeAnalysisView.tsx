import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { AnalysisResult } from '../../services/analysisApi';
import { getDisplayScores } from '../../utils/scoreUtils';
import { ResumeQualityFeedback } from '../ResumeQualityFeedback';

interface ResumeAnalysisViewProps {
  analysisResult: AnalysisResult;
  isWebSocketConnected: boolean;
  onStartOptimization: () => void;
  onStartNew: () => void;
}

function getScoreLevel(score: number): string {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function getBreakdownColorClass(score: number): string {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

export const ResumeAnalysisView: React.FC<ResumeAnalysisViewProps> = ({
  analysisResult,
  isWebSocketConnected,
  onStartOptimization,
  onStartNew,
}) => {
  const { scoreBefore } = getDisplayScores(analysisResult);

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

        {/* Current ATS Score - Full Width Card */}
        <Card className="score-card">
          <CardHeader>
            <div className="score-header">
              <CardTitle>Current ATS Score</CardTitle>
              <Badge className={`score-badge score-${getScoreLevel(scoreBefore)}`}>
                {scoreBefore}/100
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Breakdown Cards - All 4 in One Row */}
        <div className="breakdown-cards-row">
          <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.keyword_match)}`}>
            <CardContent className="pt-6">
              <div className="breakdown-item-content">
                <span className="label">Keyword Match</span>
                <span className="value">{analysisResult.ats_analysis.before.breakdown.keyword_match}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.experience_relevance)}`}>
            <CardContent className="pt-6">
              <div className="breakdown-item-content">
                <span className="label">Experience Relevance</span>
                <span className="value">{analysisResult.ats_analysis.before.breakdown.experience_relevance}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.education_match)}`}>
            <CardContent className="pt-6">
              <div className="breakdown-item-content">
                <span className="label">Education Match</span>
                <span className="value">{analysisResult.ats_analysis.before.breakdown.education_match}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`breakdown-card breakdown-${getBreakdownColorClass(analysisResult.ats_analysis.before.breakdown.structure_quality)}`}>
            <CardContent className="pt-6">
              <div className="breakdown-item-content">
                <span className="label">Structure Quality</span>
                <span className="value">{analysisResult.ats_analysis.before.breakdown.structure_quality}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Feedback */}
        {(analysisResult.resume_quality || analysisResult.comprehensive_feedback) && (
          <ResumeQualityFeedback
            qualityScore={analysisResult.resume_quality || null}
            comprehensiveFeedback={analysisResult.comprehensive_feedback || null}
            atsScore={scoreBefore}
          />
        )}

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="insights-grid">
              {analysisResult.ats_analysis.ai_insights.strengths.length > 0 && (
                <div className="insight-card strengths">
                  <h3>✅ Strengths</h3>
                  <ul>
                    {analysisResult.ats_analysis.ai_insights.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysisResult.ats_analysis.ai_insights.weaknesses.length > 0 && (
                <div className="insight-card weaknesses">
                  <h3>⚠️ Weaknesses</h3>
                  <ul>
                    {analysisResult.ats_analysis.ai_insights.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysisResult.ats_analysis.ai_insights.recommendations.length > 0 && (
                <div className="insight-card recommendations">
                  <h3>💡 Recommendations</h3>
                  <ul>
                    {analysisResult.ats_analysis.ai_insights.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optimize Button */}
        <Card className="optimize-action">
          <CardContent className="pt-6">
            <Button 
              onClick={onStartOptimization} 
              size="lg"
              className="btn-optimize w-full"
              disabled={!isWebSocketConnected}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {!isWebSocketConnected ? 'Connecting...' : 'Optimize Resume & Generate New Version'}
            </Button>
            {!isWebSocketConnected && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Waiting for server connection...
              </p>
            )}
            <p className="optimize-note">
              This will generate an optimized resume with improved ATS score and better keyword alignment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

