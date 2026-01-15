import React from 'react';
import { SharedStatusDisplay } from './SharedStatusDisplay';

interface AnalysisStatusDisplayProps {
  analysisId: string;
}

export const AnalysisStatusDisplay: React.FC<AnalysisStatusDisplayProps> = ({ analysisId }) => {
  return (
    <SharedStatusDisplay 
      analysisId={analysisId} 
      title="Analysis Status"
      showDetailedInfo={false}
    />
  );
};