/** Achievement type matching backend (POST /api/profile/resume/details) */
export type AchievementItem = {
  description: string;
  year?: string | number;
  link?: string;
};

/** Backend accepts either legacy string[] or new object[] */
export type AchievementsPayload = (string | AchievementItem)[];

/** Normalize API response to always use object form for the form */
export function normalizeAchievements(
  raw: (string | AchievementItem)[] | undefined
): AchievementItem[] {
  if (!raw?.length) return [];
  return raw.map((a) =>
    typeof a === "string"
      ? { description: a }
      : { description: a.description ?? "", year: a.year, link: a.link }
  );
}

/** When submitting, send as object[] (backend accepts both). Ensures year/link are posted. */
export function achievementsForSubmit(
  items: (string | AchievementItem)[] | undefined
): AchievementItem[] {
  const normalized = normalizeAchievements(items);
  return normalized
    .filter((a) => a.description?.trim())
    .map((a) => ({
      description: a.description.trim(),
      ...(a.year != null &&
        a.year !== "" && {
          year:
            typeof a.year === "number" ? a.year : Number(a.year) || a.year,
        }),
      ...(a.link?.trim() && { link: a.link.trim() }),
    }));
}
