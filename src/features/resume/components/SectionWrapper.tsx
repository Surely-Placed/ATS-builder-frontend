import React from "react";
import type { ChangeHighlight } from "@/types/resume/preview";
import { SECTION_THEMES } from "@/constants/resume/preview";
import { getSectionStyles } from "@/utils/resume/preview";

interface SectionWrapperProps {
  sectionKey: keyof typeof SECTION_THEMES;
  changes: ChangeHighlight[];
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  sectionKey,
  changes,
  children,
}) => {
  const hasChanges = changes.length > 0;
  const theme = SECTION_THEMES[sectionKey];
  const className = getSectionStyles(theme.color, hasChanges);

  return <div className={className}>{children}</div>;
};
