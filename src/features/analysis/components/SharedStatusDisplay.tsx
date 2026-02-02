import React from 'react';
import { useUnifiedAnalysisPolling } from '@/features/analysis/hooks/useUnifiedAnalysisPolling';

interface SharedStatusDisplayProps {
  analysisId: string;
  title?: string;
  showLoadButton?: boolean;
  showStopButton?: boolean;
  showDetailedInfo?: boolean;
  config?: Partial<{
    maxPolls: number;
    timeoutMs: number;
    initialInterval: number;
    maxInterval: number;
    backoffMultiplier: number;
    noChangeThreshold: number;
    fetchFullDataOnComplete: boolean;
  }>;
}

export const SharedStatusDisplay: React.FC<SharedStatusDisplayProps> = ({ 
  analysisId, 
  title = "Analysis Status", 
  showLoadButton = true, 
  showStopButton = true, 
  showDetailedInfo = false,
  config = {}
}) => {
  const { 
    analysisStatus, 
    errors, 
    startPolling, 
    stopPolling, 
    getIsPolling,
    loadingStates
  } = useUnifiedAnalysisPolling(config);
  
  const currentStatus = analysisStatus[analysisId];

  const handleStart = () => {
    if (analysisId) startPolling(analysisId);
  };

  const handleStop = () => {
    if (analysisId) stopPolling(analysisId);
  };

  if (errors[analysisId]) {
    return <div className="text-red-500">Error: {errors[analysisId]}</div>;
  }

  return (
    <div className="shared-status-display p-4 border rounded">
      <h3 className="font-bold mb-2">{title}</h3>
      {currentStatus ? (
        <div className="space-y-1">
          <p><span className="font-semibold">Status:</span> {currentStatus.status}</p>
          {currentStatus.atsScoreBefore !== undefined && (
            <p><span className="font-semibold">Before:</span> {currentStatus.atsScoreBefore}%</p>
          )}
          {currentStatus.atsScoreAfter !== undefined && (
            <p><span className="font-semibold">After:</span> {currentStatus.atsScoreAfter}%</p>
          )}
          {showDetailedInfo && (
            <>
              <p><span className="font-semibold">ID:</span> {currentStatus.analysisId}</p>
              <p><span className="font-semibold">Created:</span> {currentStatus.createdAt.toString()}</p>
            </>
          )}
        </div>
      ) : (
        <div>
          <p>Status not loaded.</p>
          {(showLoadButton || showStopButton) && (
            <div className="mt-2">
              {showLoadButton && (
                <button className="btn-primary mr-2" onClick={handleStart}>
                  Load Status
                </button>
              )}
              {showStopButton && (
                <button className="btn-secondary" onClick={handleStop}>
                  Stop
                </button>
              )}
            </div>
          )}
        </div>
      )}
      {getIsPolling(analysisId) && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          Polling for updates...
        </div>
      )}
      {loadingStates[analysisId] && (
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
          Loading full analysis data...
        </div>
      )}
    </div>
  );
};