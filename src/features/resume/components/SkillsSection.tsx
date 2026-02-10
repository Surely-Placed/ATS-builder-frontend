import React from "react";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { highlightArrayItem } from "@/utils/resume/textDiffHighlight";

interface SkillsSectionProps {
  resume: ResumeStructure;
  originalResume?: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  resume,
  originalResume,
  changes,
  isExpanded,
  viewMode,
  onToggle,
}) => {
  const isReordered = changes.some((c) => c.changeType === "reordered");
  
  // Handle both string[] and categorized skills object structure
  const allSkills: string[] = React.useMemo(() => {
    if (!resume.skills) return [];
    return resume.skills.flatMap((skill: any) => {
      if (typeof skill === 'string') return skill;
      // If it's a categorized skill object { category: string, items: string[] }
      if (typeof skill === 'object' && skill !== null) {
        if (Array.isArray(skill.items)) return skill.items;
        // Fallback for other potential object structures or just ignoring unknown objects
        return [];
      }
      return [];
    });
  }, [resume.skills]);

  const skillsToShow = isExpanded ? allSkills : allSkills.slice(0, 8);
  const hasMoreSkills = allSkills.length > 8;

  return (
    <SectionWrapper sectionKey="skills" changes={changes}>
      <SectionHeader title="Skills" sectionKey="skills" changes={changes} />
      <div className="flex flex-wrap gap-2">
        {skillsToShow.map((skill, index) => {
          const hasSkillChanges = changes.length > 0;

          return (
            <span
              key={index}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                hasSkillChanges
                  ? "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 border-2 border-yellow-400 dark:border-yellow-600 shadow-sm"
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
          {isExpanded ? "▼ Show less" : `▶ Show more (${allSkills.length - 8} more)`}
        </button>
      )}
    </SectionWrapper>
  );
};
