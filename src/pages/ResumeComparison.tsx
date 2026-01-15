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

  return (
    <DashboardLayout activeTab="Resume Optimization">
      <ComparisonView
        originalAnalysis={originalAnalysis}
        optimizedResult={optimizedResult}
        onDownload={() => { /* noop - keep same UX in page */ }}
        onStartNew={() => navigate('/resume-analysis')}
        onPreview={() => navigate(`/resume-preview/${analysisId}`)}
      />
    </DashboardLayout>
  );
}
