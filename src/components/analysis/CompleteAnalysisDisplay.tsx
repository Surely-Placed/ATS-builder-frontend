import React, { useEffect } from 'react';
import { useCompleteAnalysisPolling } from '../../hooks/useCompleteAnalysisPolling';

interface CompleteAnalysisDisplayProps {
  analysisId: string;
}

export const CompleteAnalysisDisplay: React.FC<CompleteAnalysisDisplayProps> = ({ analysisId }) => {
  const { 
    fullAnalysisData, 
    errors, 
    isLoading, 
    startPolling, 
    isDataComplete,
    hasError 
  } = useCompleteAnalysisPolling();
  
  const data = fullAnalysisData[analysisId];

  useEffect(() => {
    if (analysisId) {
      startPolling(analysisId);
    }
  }, [analysisId, startPolling]);

  if (hasError(analysisId)) {
    return <div className="text-red-500">Error: {errors[analysisId]}</div>;
  }

  if (isLoading(analysisId)) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
        <span>Loading complete analysis...</span>
      </div>
    );
  }

  if (!data) {
    return <div>Loading analysis data...</div>;
  }

  // Helper function to render field with fallback
  const renderField = (value: any, label: string, fallback: string = "Not Available") => {
    if (value === null || value === undefined || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0)) {
      return <span className="text-gray-500 italic">{fallback}</span>;
    }
    return <span>{value.toString()}</span>;
  };

  return (
    <div className="analysis-complete-display p-6">
      <h2 className="text-xl font-bold mb-4">Complete Analysis Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Analysis Info */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Analysis Info</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">ID:</span> {renderField(data.analysis?.id, "ID")}</p>
            <p><span className="font-medium">ATS Score Before:</span> {renderField(data.analysis?.ats_score_before, "ATS Score Before", "Not Available")}</p>
            <p><span className="font-medium">ATS Score After:</span> {renderField(data.analysis?.ats_score_after, "ATS Score After", "Not Available")}</p>
            <p><span className="font-medium">Quality Score:</span> {renderField(data.analysis?.quality_score, "Quality Score", "Not Available")}</p>
          </div>
        </div>

        {/* ATS Analysis */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">ATS Analysis</h3>
          {data.ats_analysis?.before ? (
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Before Score:</span> {renderField(data.ats_analysis.before.score, "Before Score")}</p>
              <p><span className="font-medium">Label:</span> {renderField(data.ats_analysis.before.label, "Label")}</p>
              <p><span className="font-medium">Matched Skills:</span> {renderField(data.ats_analysis.before.matched_skills?.length, "Matched Skills Count", "0")}</p>
              <p><span className="font-medium">Missing Skills:</span> {renderField(data.ats_analysis.before.missing_skills?.length, "Missing Skills Count", "0")}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">ATS analysis not available</p>
          )}
        </div>

        {/* AI Insights */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">AI Insights</h3>
          {data.ats_analysis?.ai_insights ? (
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Strengths:</span> {renderField(data.ats_analysis.ai_insights.strengths?.length, "Strengths Count", "0")}</p>
              <p><span className="font-medium">Weaknesses:</span> {renderField(data.ats_analysis.ai_insights.weaknesses?.length, "Weaknesses Count", "0")}</p>
              <p><span className="font-medium">Recommendations:</span> {renderField(data.ats_analysis.ai_insights.recommendations?.length, "Recommendations Count", "0")}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">AI insights not available</p>
          )}
        </div>

        {/* Resume Quality */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Resume Quality</h3>
          {data.resume_quality ? (
            <div className="text-sm">
              <p><span className="font-medium">Quality Analysis:</span> Available</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">Resume quality analysis not available</p>
          )}
        </div>

        {/* Optimized Resume */}
        <div className="border p-4 rounded md:col-span-2">
          <h3 className="font-semibold mb-2">Optimized Resume</h3>
          {data.optimized_resume ? (
            <div className="text-sm">
              <p><span className="font-medium">File URL:</span> {renderField(data.optimized_resume.file_url, "File URL")}</p>
              <a 
                href={data.optimized_resume.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Optimized Resume
              </a>
            </div>
          ) : (
            <p className="text-gray-500 italic">Optimized resume not available yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
