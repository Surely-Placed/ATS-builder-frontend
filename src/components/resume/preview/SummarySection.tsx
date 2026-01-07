import React from "react";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { highlightText } from "@/utils/resume/preview";

interface SummarySectionProps {
  resume: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  resume,
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
            {highlightText(resume.summary, changes, "content")}
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
