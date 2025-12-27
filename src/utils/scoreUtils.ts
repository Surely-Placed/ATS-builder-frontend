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
  // Note: Real scores are >= 80, so we'll map them appropriately
  if (data.analysis?.ats_score_before !== undefined) {
    const realBefore = data.analysis.ats_score_before;
    const realAfter = data.analysis.ats_score_after ?? null;
    
    // Map real scores (>= 80) to display ranges
    // Before: 50-60, After: 80-90
    const scoreBefore = mapToBeforeRange(realBefore);
    const scoreAfter = realAfter !== null ? mapToAfterRange(realAfter) : null;
    const improvement = scoreAfter !== null ? scoreAfter - scoreBefore : null;
    
    return {
      scoreBefore,
      scoreAfter,
      improvement,
      realScoreBefore: realBefore,
      realScoreAfter: realAfter ?? undefined,
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
 */
function mapToBeforeRange(realScore: number): number {
  const normalized = Math.max(realScore, 80);
  if (normalized >= 95) return 58 + Math.floor(Math.random() * 3); // 58-60
  if (normalized >= 90) return 56 + Math.floor(Math.random() * 4); // 56-59
  if (normalized >= 85) return 53 + Math.floor(Math.random() * 4); // 53-56
  return 50 + Math.floor(Math.random() * 4); // 50-53
}

/**
 * Map real score (>= 80) to after optimization range (80-90)
 */
function mapToAfterRange(realScore: number): number {
  const normalized = Math.max(realScore, 80);
  if (normalized >= 95) return 88 + Math.floor(Math.random() * 3); // 88-90
  if (normalized >= 90) return 86 + Math.floor(Math.random() * 4); // 86-89
  if (normalized >= 85) return 83 + Math.floor(Math.random() * 4); // 83-86
  return 80 + Math.floor(Math.random() * 4); // 80-83
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
