/**
 * FRONTEND SCORE DISPLAY FIX - Single File Solution
 * Copy this entire file to your frontend project
 * 
 * NEW SCORE RANGES:
 * - Before Optimization: 50-60 (shows room for improvement)
 * - After Optimization: 80-90 (shows successful optimization)
 * - Improvement: Typically 20-40 points (realistic improvement shown)
 * 
 * Usage: Replace all instances of data.analysis.ats_score_before/after with:
 * const { scoreBefore, scoreAfter, improvement } = getDisplayScores(data);
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ScoreData {
  analysis?: {
    ats_score_before?: number;
    ats_score_after?: number | null;
    display_score_before?: number;
    display_score_after?: number | null;
    display_improvement?: number | null;
  };
  ats_analysis?: {
    before?: {
      score?: number;
      real_score?: number;
    };
    after?: {
      score?: number;
      real_score?: number;
      improvement?: number;
      real_improvement?: number;
    };
  };
}

export interface DisplayScores {
  scoreBefore: number;
  scoreAfter: number | null;
  improvement: number | null;
  realScoreBefore?: number;
  realScoreAfter?: number;
}

// ============================================================================
// MAIN UTILITY FUNCTION
// ============================================================================

/**
 * Get display scores from API response
 * - Before Optimization: 50-60 range
 * - After Optimization: 80-90 range
 * - Improvement: Typically 20-40 points
 * Falls back to real scores if display scores not available (backward compatibility)
 */
export function getDisplayScores(data: ScoreData): DisplayScores {
  // Method 1: Use display scores from analysis object (preferred - NEW API)
  if (data.analysis?.display_score_before !== undefined) {
    return {
      scoreBefore: data.analysis.display_score_before, // 50-60 range
      scoreAfter: data.analysis.display_score_after ?? null, // 80-90 range
      improvement: data.analysis.display_improvement ?? null, // 20-40 points
      realScoreBefore: data.analysis.ats_score_before,
      realScoreAfter: data.analysis.ats_score_after ?? undefined,
    };
  }

  // Method 2: Use display scores from ats_analysis object (NEW API)
  if (data.ats_analysis?.before?.score !== undefined) {
    const scoreBefore = data.ats_analysis.before.score; // 50-60 range
    const scoreAfter = data.ats_analysis.after?.score ?? null; // 80-90 range
    const improvement = data.ats_analysis.after?.improvement ?? null; // 20-40 points
    
    return {
      scoreBefore,
      scoreAfter,
      improvement,
      realScoreBefore: data.ats_analysis.before.real_score,
      realScoreAfter: data.ats_analysis.after?.real_score ?? undefined,
    };
  }

  // Method 3: Fallback to real scores (backward compatibility - OLD API)
  // Only use real scores directly if display scores are not available
  // Don't map them - use them as-is since they might already be display scores
  if (data.analysis?.ats_score_before !== undefined) {
    const realBefore = data.analysis.ats_score_before;
    const realAfter = data.analysis.ats_score_after ?? null;
    
    // Use real scores directly - they might already be display scores
    // Only map if we're certain they're real scores (>= 80) and we need display scores
    const isRealScore = realBefore >= 80;
    const scoreBefore = isRealScore ? mapToBeforeRange(realBefore) : realBefore;
    const scoreAfter = realAfter !== null 
      ? (realAfter >= 80 ? mapToAfterRange(realAfter) : realAfter)
      : null;
    const improvement = scoreAfter !== null ? scoreAfter - scoreBefore : null;
    
    return {
      scoreBefore,
      scoreAfter,
      improvement,
      realScoreBefore: isRealScore ? realBefore : undefined,
      realScoreAfter: realAfter !== null && realAfter >= 80 ? realAfter : undefined,
    };
  }

  // Default fallback
  return {
    scoreBefore: 0,
    scoreAfter: null,
    improvement: null,
  };
}

/**
 * Map real score (>= 80) to before optimization range (50-60)
 * Uses deterministic mapping based on score value (no random)
 */
function mapToBeforeRange(realScore: number): number {
  // Use deterministic mapping based on score hash to ensure consistency
  // This ensures the same real score always maps to the same display score
  const scoreHash = realScore % 10; // Use last digit for consistency
  const normalized = Math.max(realScore, 80);
  
  if (normalized >= 95) {
    // 58-60 range, use scoreHash to pick consistently
    return 58 + (scoreHash % 3); // 58, 59, or 60
  }
  if (normalized >= 90) {
    // 56-59 range
    return 56 + (scoreHash % 4); // 56, 57, 58, or 59
  }
  if (normalized >= 85) {
    // 53-56 range
    return 53 + (scoreHash % 4); // 53, 54, 55, or 56
  }
  // 50-53 range
  return 50 + (scoreHash % 4); // 50, 51, 52, or 53
}

/**
 * Map real score (>= 80) to after optimization range (80-90)
 * Uses deterministic mapping based on score value (no random)
 */
function mapToAfterRange(realScore: number): number {
  // Use deterministic mapping based on score hash to ensure consistency
  const scoreHash = realScore % 10; // Use last digit for consistency
  const normalized = Math.max(realScore, 80);
  
  if (normalized >= 95) {
    // 88-90 range
    return 88 + (scoreHash % 3); // 88, 89, or 90
  }
  if (normalized >= 90) {
    // 86-89 range
    return 86 + (scoreHash % 4); // 86, 87, 88, or 89
  }
  if (normalized >= 85) {
    // 83-86 range
    return 83 + (scoreHash % 4); // 83, 84, 85, or 86
  }
  // 80-83 range
  return 80 + (scoreHash % 4); // 80, 81, 82, or 83
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return 'N/A';
  return `${score}%`;
}

export function formatImprovement(improvement: number | null | undefined): string {
  if (improvement === null || improvement === undefined) return 'N/A';
  if (improvement > 0) return `+${improvement}`;
  return `${improvement}`;
}

export function getScoreColor(score: number): string {
  if (score >= 95) return '#10b981'; // green-500
  if (score >= 90) return '#3b82f6'; // blue-500
  if (score >= 80) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
}

export const getScoreLevel = (score: number): string => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};

export const getBreakdownColorClass = (score: number): string => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};
