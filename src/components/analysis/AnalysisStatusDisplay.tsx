import { useEffect } from 'react';
import { useSmartAnalysisPolling } from '@/hooks/useSmartAnalysisPolling';

interface AnalysisStatusDisplayProps {
  analysisId: string;
}

export const AnalysisStatusDisplay: React.FC<AnalysisStatusDisplayProps> = ({ analysisId }) => {
  const { analysisStatus, errors, startPolling, stopPolling, getIsPolling } = useSmartAnalysisPolling();
  const currentStatus = analysisStatus[analysisId];

  useEffect(() => {
    if (analysisId) {
      startPolling(analysisId);
    }

    return () => {
      stopPolling(analysisId);
    };
  }, [analysisId]);

  if (errors[analysisId]) {
    return <div className="text-red-500">Error: {errors[analysisId]}</div>;
  }

  return (
    <div className="analysis-status-display p-4 border rounded">
      <h3 className="font-bold mb-2">Analysis Status</h3>
      {currentStatus ? (
        <div className="space-y-1">
          <p><span className="font-semibold">Status:</span> {currentStatus.status}</p>
          {currentStatus.atsScoreBefore !== undefined && (
            <p><span className="font-semibold">Before:</span> {currentStatus.atsScoreBefore}%</p>
          )}
          {currentStatus.atsScoreAfter !== undefined && (
            <p><span className="font-semibold">After:</span> {currentStatus.atsScoreAfter}%</p>
          )}
        </div>
      ) : (
        <p>Loading status...</p>
      )}
      {getIsPolling(analysisId) && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          Polling for updates...
        </div>
      )}
    </div>
  );
};