import React from 'react';

type AnalysisResult = any;

export const ScoreSummary: React.FC<{ analysis: AnalysisResult }> = ({ analysis }) => {
  const before = analysis?.ats_analysis?.before ?? null;
  const after = analysis?.ats_analysis?.after ?? null;

  // Top-level fallbacks for some endpoints
  const topBefore = analysis?.analysis?.ats_score_before ?? analysis?.atsScoreBefore ?? null;
  const topAfter = analysis?.analysis?.ats_score_after ?? analysis?.atsScoreAfter ?? null;

  const beforeDisplay = before?.display_score ?? before?.real_score ?? before?.score ?? topBefore ?? null;
  const afterDisplay = after?.display_score ?? after?.real_score ?? after?.score ?? topAfter ?? null;

  const displayImprovement = after?.display_improvement ?? (afterDisplay !== null && beforeDisplay !== null ? afterDisplay - beforeDisplay : null);
  const direction = after?.display_improvement_direction
    ?? (displayImprovement === null ? 'none' : displayImprovement > 0 ? 'increase' : displayImprovement < 0 ? 'decrease' : 'none');

  const badgeText = displayImprovement === null
    ? 'No change'
    : `${Math.abs(displayImprovement)} pts ${direction === 'increase' ? 'improvement' : direction === 'decrease' ? 'decrease' : ''}`;

  const badgeColor = direction === 'increase' ? '#0f9d58' : direction === 'decrease' ? '#db4437' : '#6c757d';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 700 }}>{beforeDisplay ?? '—'}</div>
        <div style={{ fontSize: 12, color: '#666' }}>Before</div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 700 }}>{afterDisplay ?? '—'}</div>
        <div style={{ fontSize: 12, color: '#666' }}>After</div>
      </div>

      <div style={{ padding: '8px 12px', borderRadius: 8, background: badgeColor, color: '#fff', minWidth: 120, textAlign: 'center' }}>
        <div style={{ fontWeight: 700 }}>{badgeText}</div>
        <div style={{ fontSize: 11, opacity: 0.9 }}>{direction === 'increase' ? 'Better' : direction === 'decrease' ? 'Worse' : 'No change'}</div>
      </div>
    </div>
  );
};

export default ScoreSummary;
