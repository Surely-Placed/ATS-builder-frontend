/**
 * Verification utility for ATS scores
 * Use this to debug and verify ATS score data from API responses
 */

import { AnalysisResult } from "@/features/analysis/services/types";

export interface AtsScoreVerification {
  before: {
    display: number | null;
    real: number | null;
    fromAnalysis: number | null;
    displayFromAnalysis: number | null;
    fromAtsAnalysis: number | null;
  };
  after: {
    display: number | null;
    real: number | null;
    fromAnalysis: number | null;
    displayFromAnalysis: number | null;
    fromAtsAnalysis: number | null;
    improvement: number | null;
  } | null;
  improvement: {
    points: number | null;
    percent: string | null;
    displayImprovement: number | null;
  } | null;
}

/**
 * Verify and log ATS scores from analysis result
 */
export const verifyAtsScores = (result: AnalysisResult): AtsScoreVerification => {
  const verification: AtsScoreVerification = {
    before: {
      display: null,
      real: null,
      fromAnalysis: null,
      displayFromAnalysis: null,
      fromAtsAnalysis: null,
    },
    after: null,
    improvement: null,
  };

  // Before Score
  verification.before.display = result.ats_analysis?.before?.score || null;
  verification.before.real = result.ats_analysis?.before?.real_score || null;
  verification.before.fromAnalysis = result.analysis?.ats_score_before || null;
  verification.before.displayFromAnalysis = (result.analysis as any)?.display_score_before || null;
  verification.before.fromAtsAnalysis = result.ats_analysis?.before?.score || null;

  // After Score (if available)
  if (result.ats_analysis?.after || result.analysis?.ats_score_after) {
    verification.after = {
      display: result.ats_analysis?.after?.score || null,
      real: result.ats_analysis?.after?.real_score || null,
      fromAnalysis: result.analysis?.ats_score_after || null,
      displayFromAnalysis: (result.analysis as any)?.display_score_after || null,
      fromAtsAnalysis: result.ats_analysis?.after?.score || null,
      improvement: result.ats_analysis?.after?.improvement || null,
    };

    // Calculate improvement
    const beforeReal = verification.before.real || verification.before.fromAnalysis || 0;
    const afterReal = verification.after.real || verification.after.fromAnalysis || 0;

    if (beforeReal > 0 && afterReal > 0) {
      const points = afterReal - beforeReal;
      const percent = ((points / beforeReal) * 100).toFixed(2) + "%";

      verification.improvement = {
        points,
        percent,
        displayImprovement:
          (result.analysis as any)?.display_improvement || result.ats_analysis?.after?.improvement || null,
      };
    }
  }

  // Log verification


  if (verification.after) {
      if (verification.improvement) {
    }
  } else {

  }
  return verification;
};

/**
 * Get ATS scores in a standardized format
 */
export const getAtsScores = (result: AnalysisResult) => {
  const beforeScore =
    result.ats_analysis?.before?.score ||
    (result.analysis as any)?.display_score_before ||
    result.analysis?.ats_score_before ||
    0;

  const beforeReal =
    result.ats_analysis?.before?.real_score || result.analysis?.ats_score_before || 0;

  const afterScore =
    result.ats_analysis?.after?.score ||
    (result.analysis as any)?.display_score_after ||
    result.analysis?.ats_score_after ||
    null;

  const afterReal =
    result.ats_analysis?.after?.real_score || result.analysis?.ats_score_after || null;

  const improvement =
    result.ats_analysis?.after?.improvement ||
    (result.analysis as any)?.display_improvement ||
    (afterReal && beforeReal ? afterReal - beforeReal : null);

  return {
    before: {
      display: beforeScore,
      real: beforeReal,
    },
    after:
      afterScore !== null
        ? {
          display: afterScore,
          real: afterReal,
        }
        : null,
    improvement,
  };
};

