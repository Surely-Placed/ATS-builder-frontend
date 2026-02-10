import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ComparisonView from '@/features/analysis/components/ComparisonView';
import AnalysisApiService from '@/services/analysisApi';
import { normalizeAnalysisResult } from '@/utils/analysisResultNormalizer';


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
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading comparison...</p>
          </div>
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
      // Fetch fresh analysis data to get the URL (matching Dashboard logic)
      const result = await AnalysisApiService.getAnalysis(analysisId);

      let pdfUrl = 
        result?.optimized_resume?.file_url || 
        result?.optimized_resume?.url || 
        result?.optimized_resume?.pdf_url ||
        result?.analysis?.optimized_file_url ||
        null;

      if (!pdfUrl) {
         try {
            const genResponse = await AnalysisApiService.generatePDF(analysisId);
            if (genResponse.success && genResponse.file_url) {
                pdfUrl = genResponse.file_url;
            }
         } catch (genErr) {
             console.error("Failed to generate PDF on demand:", genErr);
         }
      }

      if (pdfUrl) {
        AnalysisApiService.downloadResume(pdfUrl, 'optimized-resume.pdf', analysisId);
      } else {
        console.error('No optimized resume URL found', { result });
        throw new Error("Optimized resume PDF not found");
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
