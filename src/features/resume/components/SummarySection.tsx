import React from "react";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";

interface SummarySectionProps {
  resume: ResumeStructure;
  originalResume?: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  resume,
  originalResume,
  changes,
  isExpanded,
  viewMode,
  onToggle,
}) => {
  return (
    <SectionWrapper sectionKey="summary" changes={changes}>
      <SectionHeader title="Summary" sectionKey="summary" changes={changes} />
      {resume.summary && (
        <>
          <div
            className={`text-muted-foreground leading-relaxed ${isExpanded ? "block" : viewMode === "split" ? "line-clamp-3" : "block"}`}
          >
            {changes.length > 0 ? (
              <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                {resume.summary}
              </span>
            ) : (
              resume.summary
            )}
          </div>
          {viewMode === "split" && resume.summary.length > 150 && (
            <button onClick={onToggle} className="text-primary text-sm mt-1 hover:underline">
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </>
      )}
    </SectionWrapper>
  );
};
