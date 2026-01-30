import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ComparisonView from '@/components/analysis/ComparisonView';
import AnalysisApiService from '@/services/analysisApi';
import { normalizeAnalysisResult } from '@/utils/analysisResultNormalizer';
import { AnalysisResult } from '@/services/analysis';

export default function ResumeComparison() {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  const navigate = useNavigate();

  const [originalAnalysis, setOriginalAnalysis] = useState<any | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  useEffect(() => {
    if (!analysisId) {
      // No analysisId — redirect to analysis start
      navigate('/resume-analysis');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const response = await AnalysisApiService.getAnalysis(analysisId);
        const normalized = normalizeAnalysisResult(response);

        // originalAnalysis is the normalized analysis object
        setOriginalAnalysis(normalized);

        // Construct an optimization-like result object from the normalized analysis
        // so ComparisonView can render even when no separate optimization payload exists.
        const optimizedLike = {
          analysis: normalized.analysis || null,
          original_resume: normalized.original_resume || null,
          optimized_resume: normalized.optimized_resume || null,
          ats_analysis: {
            // Preserve proper before/after mapping so ComparisonView shows
            // the original (before) score from the normalized analysis and
            // the optimized (after) score where expected.
            before: normalized.ats_analysis?.before || null,
            after: normalized.ats_analysis?.after || null,
            ai_insights: normalized.ats_analysis?.ai_insights || null,
          },
          final_audit: normalized.final_audit || null,
        };

        setOptimizedResult(optimizedLike);
      } catch (err) {
        // If fetch fails, send user back to analysis start
        navigate('/resume-analysis');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [analysisId, navigate]);

  if (loading) {
    return (
      <DashboardLayout activeTab="Resume Optimization">
        <div className="min-h-[400px] flex items-center justify-center">
          <div>Loading comparison...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!originalAnalysis || !optimizedResult) {
    return (
      <DashboardLayout activeTab="Resume Optimization">
        <div className="min-h-[400px] flex items-center justify-center">
          <div>Comparison not available.</div>
        </div>
      </DashboardLayout>
    );
  }

  const handleDownload = async () => {
    setIsDownloadLoading(true);
    try {
      // Get the optimized resume URL from the current data
      const pdfUrl = 
        optimizedResult?.optimized_resume?.url || 
        optimizedResult?.optimized_resume?.file_url || 
        optimizedResult?.optimized_resume?.pdf_url ||
        null;

      if (pdfUrl) {
        // Download the PDF directly
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'optimized-resume.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('No optimized resume URL found');
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  const handlePreview = () => {
    setIsPreviewLoading(true);
    navigate(`/resume-preview/${analysisId}`);
    // No need to reset loading as navigation happens immediately
  };

  return (
    <DashboardLayout activeTab="Resume Optimization">
      <ComparisonView
        originalAnalysis={originalAnalysis}
        optimizedResult={optimizedResult}
        onDownload={handleDownload}
        onStartNew={() => navigate('/resume-analysis')}
        onPreview={handlePreview}
        isPreviewLoading={isPreviewLoading}
        isDownloadLoading={isDownloadLoading}
      />
    </DashboardLayout>
  );
}
