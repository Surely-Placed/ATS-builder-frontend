import React from "react";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";

interface SkillsSectionProps {
  resume: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  resume,
  changes,
  isExpanded,
  viewMode,
  onToggle,
}) => {
  const isReordered = changes.some((c) => c.changeType === "reordered");
  const skillsToShow = isExpanded ? resume.skills : resume.skills.slice(0, 8);
  const hasMoreSkills = resume.skills.length > 8;

  return (
    <SectionWrapper sectionKey="skills" changes={changes}>
      <SectionHeader title="Skills" sectionKey="skills" changes={changes} />
      <div className="flex flex-wrap gap-2">
        {skillsToShow.map((skill, index) => {
          const skillChange = changes.find(
            (c) => c.field === `skill_${index}` || c.field === "order"
          );
          const isModified = skillChange?.changeType === "modified";

          return (
            <span
              key={index}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isModified
                  ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 border-2 border-yellow-400 dark:border-yellow-600 shadow-sm"
                  : isReordered && index < 8
                    ? "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 border-2 border-blue-400 dark:border-blue-600 shadow-sm"
                    : "bg-muted text-foreground border border-border"
              }`}
            >
              {skill}
            </span>
          );
        })}
      </div>
      {viewMode === "split" && hasMoreSkills && (
        <button
          onClick={onToggle}
          className="text-primary text-xs mt-2 hover:underline font-medium"
        >
          {isExpanded ? "▼ Show less" : `▶ Show more (${resume.skills.length - 8} more)`}
        </button>
      )}
    </SectionWrapper>
  );
};
