/**
 * Strips markdown asterisks from text so they don't show in preview.
 * Removes ** (bold) and * (italic) markers.
 */
export function stripMarkdownAsterisks(text: string): string {
  if (typeof text !== "string") return "";
  return text.replace(/\*\*/g, "").replace(/\*/g, "");
}

/** Sanitize a string for use in a filename (replace spaces and invalid chars with underscore). */
export function sanitizeForFilename(s: string): string {
  if (typeof s !== "string") return "resume";
  return s
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "") || "resume";
}

/** Build PDF filename: {name}_{job_title}.pdf */
export function buildResumePdfFilename(name: string, jobTitle: string): string {
  const n = sanitizeForFilename(name || "resume");
  const j = sanitizeForFilename(jobTitle || "resume");
  return `${n}_${j}.pdf`;
}

/**
 * Parses backend improved-experience text for display:
 * - Strips leading "Role at Company - " (hardcoded in backend, not needed in UI).
 * - Splits on " - " only when it starts a new bullet (next char uppercase), so phrases
 *   like "test - driven" or "real - time" are not split.
 */
export function parseExperienceBullets(line: string): string[] {
  if (typeof line !== "string") return [];
  let text = line.trim();
  // Remove optional "Role at Company - " prefix (e.g. "Software Engineer at PayPal - ", "Associate Software Developer at Zoho - ")
  text = text.replace(/^.*\s+at\s+.*?\s*-\s*/, "").trim();
  // Only split when " - " is followed by uppercase (new bullet), not for compound words like "test - driven"
  return text
    .split(/\s*-\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Normalizes bullet/skill text: collapse newlines to space so "full\nstack" displays as "full stack".
 */
export function collapseNewlines(text: string): string {
  if (typeof text !== "string") return "";
  return text.replace(/\n+/g, " ").trim();
}

/**
 * Parses improved skills text (newline- or comma-separated) into an array for list display.
 */
export function parseSkillsList(skillsText: string): string[] {
  if (typeof skillsText !== "string") return [];
  return skillsText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
