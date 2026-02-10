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

  // Get ATS score from various possible locations
  const atsScoreBefore =
    result?.ats_analysis?.before?.score ??
    result?.analysis?.ats_score_before ??
    result?.ats_score_before ??
    0;

  const qualityScore =
    result?.analysis?.quality_score ??
    result?.quality_score ??
    null;

  // Get AI insights
  const aiInsights = result?.ats_analysis?.ai_insights || {
    strengths: [],
    weaknesses: [],
    recommendations: [],
  };

  // Get breakdown
  const breakdown = result?.ats_analysis?.before?.breakdown || result?.breakdown || {};

  // Helper function to determine level based on score
  const getLevel = (score: number): string => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  // Construct resume_quality if backend returns null
  let resumeQuality = result?.resume_quality;
  if (!resumeQuality && (qualityScore !== null || atsScoreBefore > 0)) {
    // Build resume_quality from available data
    resumeQuality = {
      score: qualityScore ?? atsScoreBefore,
      level: getLevel(qualityScore ?? atsScoreBefore),
      strengths: aiInsights.strengths || [],
      issues: aiInsights.weaknesses || [], // Use 'issues' to match type, from weaknesses
      improvements: aiInsights.recommendations || [],
    };
  }

  // Ensure resume_quality has all required fields if it exists
  if (resumeQuality) {
    resumeQuality = {
      score: resumeQuality.score ?? 0,
      level: resumeQuality.level ?? getLevel(resumeQuality.score ?? 0),
      strengths: resumeQuality.strengths || [],
      issues: resumeQuality.issues || resumeQuality.improvements || [],
      improvements: resumeQuality.improvements || resumeQuality.issues || [],
    };
  }

  // Construct comprehensive_feedback if backend returns null
  let comprehensiveFeedback = result?.comprehensive_feedback;
  if (!comprehensiveFeedback && atsScoreBefore > 0) {
    // Calculate overall score (average of ATS and quality, or just ATS if no quality)
    const overallScore = qualityScore !== null
      ? Math.round((atsScoreBefore + qualityScore) / 2)
      : atsScoreBefore;

    // Build comprehensive_feedback from available data
    comprehensiveFeedback = {
      overall_score: overallScore,
      ats_score: atsScoreBefore,
      quality_score: qualityScore,
      level: getLevel(overallScore),
      feedback: {
        ats_feedback: aiInsights.weaknesses?.length > 0
          ? `Areas to improve: ${aiInsights.weaknesses.slice(0, 2).join(', ')}.`
          : "Your resume's ATS compatibility could be improved with more relevant keywords.",
        quality_feedback: aiInsights.strengths?.length > 0
          ? `Strong points: ${aiInsights.strengths.slice(0, 2).join(', ')}.`
          : "Consider improving the structure and formatting of your resume.",
        combined_recommendations: aiInsights.recommendations || [],
      },
    };
  }

  // Validate and normalize structure
  const normalized: any = {
    analysis: result?.analysis || null,
    job: result?.job || null,
    original_resume: result?.original_resume || null,
    ats_analysis: result?.ats_analysis || {
      before: {
        score: atsScoreBefore,
        real_score: atsScoreBefore,
        label: "Current ATS Score",
        breakdown: breakdown,
        matched_skills: [],
        missing_skills: [],
      },
      after: null,
      ai_insights: aiInsights,
    },
    breakdown: breakdown,
    ai_insights: aiInsights,
    resume_quality: resumeQuality,
    comprehensive_feedback: comprehensiveFeedback,
    section_analysis: result?.section_analysis || null,
    optimized_resume: result?.optimized_resume || null,
    note: result?.note || "",
  };

  // Handle ats_analysis.after if it exists in the response
  if (result?.ats_analysis?.after) {
    normalized.ats_analysis.after = {
      score:
        result.ats_analysis.after.score ||
        result.analysis?.ats_score_after ||
        null,
      real_score: result.ats_analysis.after.real_score || result.analysis?.ats_score_after || null,
      label: result.ats_analysis.after.label || "Optimized ATS Score",
      breakdown: result.ats_analysis.after.breakdown || null,
      matched_skills: result.ats_analysis.after.matched_skills || [],
      missing_skills: result.ats_analysis.after.missing_skills || [],
      improvement: result.ats_analysis.after.improvement || null,
    };
  } else if (
    result?.analysis?.ats_score_after !== null &&
    result?.analysis?.ats_score_after !== undefined
  ) {
    // If after score exists in analysis object but not in ats_analysis, create it
    normalized.ats_analysis.after = {
      score: result.analysis?.ats_score_after || null,
      real_score: result.analysis?.ats_score_after || null,
      label: "Optimized ATS Score",
      breakdown: null,
      matched_skills: [],
      missing_skills: [],
      improvement: result.ats_analysis?.after?.improvement || null,
    };
  }

  // Ensure ats_analysis.before has all required fields
  if (normalized.ats_analysis?.before) {
    normalized.ats_analysis.before = {
      score: normalized.ats_analysis.before.score || normalized.analysis?.ats_score_before || 0,
      real_score:
        normalized.ats_analysis.before.real_score || normalized.analysis?.ats_score_before || 0,
      label: normalized.ats_analysis.before.label || "Current ATS Score",
      breakdown: normalized.ats_analysis.before.breakdown || normalized.breakdown || null,
      matched_skills: normalized.ats_analysis.before.matched_skills || [],
      missing_skills: normalized.ats_analysis.before.missing_skills || [],
    };
  }

  // Ensure ats_analysis structure exists
  if (!normalized.ats_analysis) {
    normalized.ats_analysis = {
      before: {
        score:
          normalized.analysis?.ats_score_before || 0,
        real_score: normalized.analysis?.ats_score_before || 0,
        label: "Current ATS Score",
        breakdown: normalized.breakdown || null,
        matched_skills: [],
        missing_skills: [],
      },
      after: normalized.analysis?.ats_score_after
        ? {
          score:
            normalized.analysis?.ats_score_after || null,
          real_score: normalized.analysis?.ats_score_after || null,
          label: "Optimized ATS Score",
          breakdown: null,
          matched_skills: [],
          missing_skills: [],
          improvement: null,
        }
        : null,
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
      id: result.id || result.analysis?.id || "",
      resume_id: result.resume_id || result.analysis?.resume_id || "",
      ats_score_before: result.ats_score_before || result.analysis?.ats_score_before || 0,
      ats_score_after: result.ats_score_after || result.analysis?.ats_score_after || null,
      quality_score:
        result.quality_score ??
        result.analysis?.quality_score ??
        result.comprehensive_feedback?.quality_score ??
        null,
      optimized_file_url: result.optimized_file_url || result.analysis?.optimized_file_url || "",
      created_at: result.created_at || result.analysis?.created_at || new Date().toISOString(),
    };
  }

  // Validate structure
  const isValid =
    normalized.analysis?.id &&
    (normalized.ats_analysis?.before || normalized.ats_analysis) &&
    (normalized.ai_insights || normalized.ats_analysis?.ai_insights);

  if (!isValid) {
    console.warn(" Invalid analysis result structure:", {
      hasAnalysis: !!normalized.analysis,
      hasAtsAnalysis: !!normalized.ats_analysis,
      hasAiInsights: !!normalized.ai_insights,
      rawResponse: apiResponse,
    });
  }

  return normalized;
}
