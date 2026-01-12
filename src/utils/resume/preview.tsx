import React from "react";
import type { ChangeHighlight, ResumeDiffResult } from "@/types/resume/preview";
import { CHANGE_TYPE_STYLES, BADGE_STYLES, SECTION_STYLES } from "@/constants/resume/preview";

export const getSectionChanges = (
  section: string,
  changes: ResumeDiffResult
): ChangeHighlight[] => {
  return changes.sections.find((s) => s.section === section)?.changes || [];
};

export const getBadgeStyles = (color: string): string => {
  return BADGE_STYLES[color] || BADGE_STYLES.blue;
};

export const getSectionStyles = (color: string, hasChanges: boolean): string => {
  if (!hasChanges) return "mb-6";
  return SECTION_STYLES[color] || "mb-6";
};

export const highlightText = (
  text: string,
  sectionChanges: ChangeHighlight[],
  field: string
): React.ReactNode => {
  const relevantChanges = sectionChanges.filter(
    (c) => c.field === field || c.field.startsWith(field)
  );
  if (relevantChanges.length === 0) return <span>{text}</span>;

  const change = relevantChanges[0];
  const highlightClass = CHANGE_TYPE_STYLES[change.changeType] || CHANGE_TYPE_STYLES.removed;

  return (
    <span className={`px-1 py-0.5 rounded border ${highlightClass} transition-colors`}>{text}</span>
  );
};

