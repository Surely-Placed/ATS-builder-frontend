import React from 'react';
import { SectionAnalysisResult, SectionIssue, SkillsSectionAnalysis } from '../services/analysisApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import './SectionAnalysisView.css';

interface SectionAnalysisViewProps {
  sectionAnalysis: SectionAnalysisResult;
}

const SectionAnalysisView: React.FC<SectionAnalysisViewProps> = ({ sectionAnalysis }) => {
  const getIssueColor = (type: SectionIssue['type'], severity: SectionIssue['severity']) => {
    const colorMap: Record<string, Record<string, string>> = {
      error: {
        critical: '#ef4444',
        high: '#f87171',
        medium: '#fca5a5',
        low: '#fecaca',
      },
      warning: {
        critical: '#f59e0b',
        high: '#fbbf24',
        medium: '#fcd34d',
        low: '#fde68a',
      },
      suggestion: {
        critical: '#3b82f6',
        high: '#60a5fa',
        medium: '#93c5fd',
        low: '#bfdbfe',
      },
      missing: {
        critical: '#6b7280',
        high: '#9ca3af',
        medium: '#d1d5db',
        low: '#e5e7eb',
      },
      ats_optimization: {
        critical: '#a855f7',
        high: '#c084fc',
        medium: '#d8b4fe',
        low: '#e9d5ff',
      },
    };
    return colorMap[type]?.[severity] || '#9ca3af';
  };

  const getIssueIcon = (type: SectionIssue['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'suggestion': return '💡';
      case 'missing': return '⬜';
      case 'ats_optimization': return '🎯';
      default: return '•';
    }
  };

  const renderSection = (
    sectionName: string,
    section: SectionAnalysisResult['sections'][keyof SectionAnalysisResult['sections']]
  ) => {
    if ('jobs' in section) {
      // Work Experience section
      const expSection = section as SectionAnalysisResult['sections']['work_experience'];
      return (
        <Card key={sectionName} className="analysis-section">
          <CardHeader>
            <div className="section-header">
              <CardTitle>{formatSectionName(sectionName)}</CardTitle>
              <Badge variant="outline" className={`status-badge status-${expSection.status}`}>
                {expSection.status.replace('_', ' ')}
              </Badge>
              <span className="section-score">{expSection.overall_score}/100</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="section-summary">{expSection.summary}</p>
            
            {expSection.jobs.map((job, idx) => (
              <div key={idx} className="job-analysis">
                <h4>{job.title} at {job.company}</h4>
                <div className="job-score">Score: {job.score}/100</div>
                {job.issues.map((issue, issueIdx) => (
                  <div
                    key={issueIdx}
                    className="issue-item"
                    style={{
                      borderLeftColor: getIssueColor(issue.type, issue.severity),
                      backgroundColor: `${getIssueColor(issue.type, issue.severity)}20`,
                    }}
                  >
                    <div className="issue-header">
                      <span className="issue-icon">{getIssueIcon(issue.type)}</span>
                      <span className="issue-title">{issue.title}</span>
                      <Badge variant="outline" className={`issue-severity severity-${issue.severity}`}>
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="issue-description">{issue.description}</p>
                    <div className="issue-location">
                      <strong>Location:</strong> {issue.location}
                    </div>
                    {issue.current && (
                      <div className="issue-current">
                        <strong>Current:</strong> <code>{issue.current}</code>
                      </div>
                    )}
                    <div className="issue-suggestion">
                      <strong>Suggestion:</strong> {issue.suggestion}
                    </div>
                    {issue.example && (
                      <div className="issue-example">
                        <strong>Example:</strong> <code>{issue.example}</code>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    // Regular section
    const regularSection = section as SectionAnalysisResult['sections']['personal_info'];
    return (
      <Card key={sectionName} className="analysis-section">
        <CardHeader>
          <div className="section-header">
            <CardTitle>{formatSectionName(sectionName)}</CardTitle>
            <Badge variant="outline" className={`status-badge status-${regularSection.status}`}>
              {regularSection.status.replace('_', ' ')}
            </Badge>
            <span className="section-score">{regularSection.score}/100</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="section-summary">{regularSection.summary}</p>
          
          {regularSection.issues.map((issue, idx) => (
            <div
              key={idx}
              className="issue-item"
              style={{
                borderLeftColor: getIssueColor(issue.type, issue.severity),
                backgroundColor: `${getIssueColor(issue.type, issue.severity)}20`,
              }}
            >
              <div className="issue-header">
                <span className="issue-icon">{getIssueIcon(issue.type)}</span>
                <span className="issue-title">{issue.title}</span>
                <Badge variant="outline" className={`issue-severity severity-${issue.severity}`}>
                  {issue.severity}
                </Badge>
              </div>
              <p className="issue-description">{issue.description}</p>
              <div className="issue-location">
                <strong>Location:</strong> {issue.location}
              </div>
              {issue.current && (
                <div className="issue-current">
                  <strong>Current:</strong> <code>{issue.current}</code>
                </div>
              )}
              <div className="issue-suggestion">
                <strong>Suggestion:</strong> {issue.suggestion}
              </div>
              {issue.example && (
                <div className="issue-example">
                  <strong>Example:</strong> <code>{issue.example}</code>
                </div>
              )}
            </div>
          ))}

          {/* Skills section has keyword alignment */}
          {'keyword_alignment' in regularSection && regularSection.keyword_alignment && (
            <div className="keyword-alignment">
              <h4>Keyword Alignment</h4>
              <div className="keyword-lists">
                {(() => {
                  const keywordAlignment = regularSection.keyword_alignment as SkillsSectionAnalysis['keyword_alignment'];
                  return (
                    <>
                      <div>
                        <strong>✅ Matched:</strong> {keywordAlignment?.matched_skills?.join(', ') || ''}
                      </div>
                      <div>
                        <strong>❌ Missing:</strong> {
                          Array.isArray(keywordAlignment?.missing_skills)
                            ? keywordAlignment.missing_skills.join(', ')
                            : ''
                        }
                      </div>
                      {
                        Array.isArray(keywordAlignment?.suggested_additions) &&
                        keywordAlignment.suggested_additions.length > 0 && (
                          <div>
                            <strong>💡 Suggested:</strong> {keywordAlignment.suggested_additions.join(', ')}
                          </div>
                        )
                      }
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="section-analysis-view">
      <Card className="overall-score">
        <CardContent className="pt-6">
          <h2>Overall Quality Score</h2>
          <div className="score-circle">
            {sectionAnalysis.overall_quality_score}/100
          </div>
        </CardContent>
      </Card>

      {sectionAnalysis.priority_actions.length > 0 && (
        <Card className="priority-actions">
          <CardHeader>
            <CardTitle>Priority Actions</CardTitle>
          </CardHeader>
          <CardContent>
            {sectionAnalysis.priority_actions.map((action, idx) => (
              <div key={idx} className={`priority-action priority-${action.priority}`}>
                <Badge variant="outline" className="priority-label">
                  {action.priority.toUpperCase()}
                </Badge>
                <span className="action-text">
                  <strong>{formatSectionName(action.section)}:</strong> {action.action}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="sections-list">
        {Object.entries(sectionAnalysis.sections).map(([name, section]) =>
          renderSection(name, section)
        )}
      </div>
    </div>
  );
};

function formatSectionName(name: string): string {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default SectionAnalysisView;

