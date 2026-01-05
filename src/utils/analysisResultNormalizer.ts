/**
 * Normalize and validate analysis result structure
 * Handles both direct result objects and wrapped API responses
 */
export function normalizeAnalysisResult(apiResponse: any) {
  // Extract data from API response wrapper
  let result = apiResponse;
  
  // Handle ResponseHelper.success() wrapper: { success: true, data: {...}, message: "..." }
  if (apiResponse?.success && apiResponse?.data) {
    result = apiResponse.data;
  }
  
  // Handle direct data access: response.data.data
  if (apiResponse?.data?.data) {
    result = apiResponse.data.data;
  }
  
  // Validate and normalize structure
  const normalized: any = {
    analysis: result?.analysis || null,
    job: result?.job || null,
    original_resume: result?.original_resume || null,
    ats_analysis: result?.ats_analysis || {
      before: {
        score: result?.analysis?.display_score_before || result?.ats_score_before || 0,
        real_score: result?.analysis?.ats_score_before || 0,
        label: 'Current ATS Score',
        breakdown: null,
        matched_skills: [],
        missing_skills: [],
      },
      after: null,
      ai_insights: result?.ats_analysis?.ai_insights || {
        strengths: [],
        weaknesses: [],
        recommendations: [],
      },
    },
    breakdown: result?.ats_analysis?.before?.breakdown || result?.breakdown || null,
    ai_insights: result?.ats_analysis?.ai_insights || result?.ai_insights || {
      strengths: [],
      weaknesses: [],
      recommendations: [],
    },
    resume_quality: result?.resume_quality || null,
    comprehensive_feedback: result?.comprehensive_feedback || null,
    section_analysis: result?.section_analysis || null,
    optimized_resume: result?.optimized_resume || null,
    note: result?.note || '',
  };
  
  // Handle ats_analysis.after if it exists in the response
  if (result?.ats_analysis?.after) {
    normalized.ats_analysis.after = {
      score: result.ats_analysis.after.score || result.analysis?.display_score_after || result.analysis?.ats_score_after || null,
      real_score: result.ats_analysis.after.real_score || result.analysis?.ats_score_after || null,
      label: result.ats_analysis.after.label || 'Optimized ATS Score',
      breakdown: result.ats_analysis.after.breakdown || null,
      matched_skills: result.ats_analysis.after.matched_skills || [],
      missing_skills: result.ats_analysis.after.missing_skills || [],
      improvement: result.ats_analysis.after.improvement || null,
    };
  } else if (result?.analysis?.ats_score_after !== null && result?.analysis?.ats_score_after !== undefined) {
    // If after score exists in analysis object but not in ats_analysis, create it
    normalized.ats_analysis.after = {
      score: result.analysis?.display_score_after || result.analysis?.ats_score_after || null,
      real_score: result.analysis?.ats_score_after || null,
      label: 'Optimized ATS Score',
      breakdown: null,
      matched_skills: [],
      missing_skills: [],
      improvement: result.analysis?.display_improvement || null,
    };
  }
  
  // Ensure ats_analysis.before has all required fields
  if (normalized.ats_analysis?.before) {
    normalized.ats_analysis.before = {
      score: normalized.ats_analysis.before.score || normalized.analysis?.display_score_before || 0,
      real_score: normalized.ats_analysis.before.real_score || normalized.analysis?.ats_score_before || 0,
      label: normalized.ats_analysis.before.label || 'Current ATS Score',
      breakdown: normalized.ats_analysis.before.breakdown || normalized.breakdown || null,
      matched_skills: normalized.ats_analysis.before.matched_skills || [],
      missing_skills: normalized.ats_analysis.before.missing_skills || [],
    };
  }
  
  // Ensure ats_analysis structure exists
  if (!normalized.ats_analysis) {
    normalized.ats_analysis = {
      before: {
        score: normalized.analysis?.display_score_before || normalized.analysis?.ats_score_before || 0,
        real_score: normalized.analysis?.ats_score_before || 0,
        label: 'Current ATS Score',
        breakdown: normalized.breakdown || null,
        matched_skills: [],
        missing_skills: [],
      },
      after: normalized.analysis?.ats_score_after ? {
        score: normalized.analysis?.display_score_after || normalized.analysis?.ats_score_after || null,
        real_score: normalized.analysis?.ats_score_after || null,
        label: 'Optimized ATS Score',
        breakdown: null,
        matched_skills: [],
        missing_skills: [],
        improvement: normalized.analysis?.display_improvement || null,
      } : null,
      ai_insights: normalized.ai_insights || {
        strengths: [],
        weaknesses: [],
        recommendations: [],
      },
    };
  }
  
  // Ensure analysis object exists with required fields
  if (!normalized.analysis && result) {
    normalized.analysis = {
      id: result.id || result.analysis?.id || '',
      resume_id: result.resume_id || result.analysis?.resume_id || '',
      job_id: result.job_id || result.analysis?.job_id || '',
      ats_score_before: result.ats_score_before || result.analysis?.ats_score_before || 0,
      ats_score_after: result.ats_score_after || result.analysis?.ats_score_after || null,
      display_score_before: result.display_score_before || result.analysis?.display_score_before || result.ats_analysis?.before?.score || null,
      display_score_after: result.display_score_after || result.analysis?.display_score_after || result.ats_analysis?.after?.score || null,
      display_improvement: result.display_improvement || result.analysis?.display_improvement || result.ats_analysis?.after?.improvement || null,
      created_at: result.created_at || result.analysis?.created_at || new Date().toISOString(),
    };
  }
  
  // Validate structure
  const isValid = 
    normalized.analysis?.id &&
    (normalized.ats_analysis?.before || normalized.ats_analysis) &&
    (normalized.ai_insights || normalized.ats_analysis?.ai_insights);
  
  if (!isValid) {
    console.warn('⚠️ Invalid analysis result structure:', {
      hasAnalysis: !!normalized.analysis,
      hasAtsAnalysis: !!normalized.ats_analysis,
      hasAiInsights: !!normalized.ai_insights,
      rawResponse: apiResponse,
    });
  }
  
  return normalized;
}

