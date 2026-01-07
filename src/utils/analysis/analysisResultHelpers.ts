import { AnalysisResult } from "@/services/analysisApi";

export function constructFallbackResult(result: any, jobTitle: string = ""): AnalysisResult {
  return {
    analysis: {
      id: result.id,
      resume_id: result.resume_id,
      job_id: result.job_id,
      ats_score_before: result.ats_score_before,
      ats_score_after: result.ats_score_after,
      created_at: result.created_at || new Date().toISOString(),
    },
    job: result.job || {
      id: result.job_id,
      title: jobTitle || "",
      company: "",
      location: "",
      extracted_data: {},
    },
    original_resume: result.original_resume || {
      file_url: "",
      structured_data: {},
    },
    ats_analysis: result.ats_analysis || {
      before: {
        score: result.ats_score_before || 0,
        label: "",
        breakdown: {
          keyword_match: 0,
          experience_relevance: 0,
          education_match: 0,
          structure_quality: 0,
        },
        matched_skills: [],
        missing_skills: [],
      },
      ai_insights: {
        strengths: [],
        weaknesses: [],
        recommendations: [],
      },
    },
    section_analysis: null,
    resume_quality: null,
    comprehensive_feedback: null,
    optimized_resume: null,
    note: "",
  };
}
