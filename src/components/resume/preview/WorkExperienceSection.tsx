import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { getBadgeStyles, highlightText } from "@/utils/resume/preview";

interface WorkExperienceSectionProps {
  resume: ResumeStructure;
  changes: ChangeHighlight[];
  expandedSections: Set<string>;
  viewMode: ViewMode;
  onToggle: (section: string) => void;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  resume,
  changes,
  expandedSections,
  viewMode,
  onToggle,
}) => {
  return (
    <SectionWrapper sectionKey="work_experience" changes={changes}>
      <SectionHeader title="Work Experience" sectionKey="work_experience" changes={changes} />
      {resume.work_experience.map((exp, expIndex) => {
        const expChanges = changes.filter((c) => c.location?.index === expIndex);
        const isExpanded = expandedSections.has(`work_${expIndex}`) || viewMode !== "split";

        return (
          <Card key={expIndex} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">{exp.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{exp.dates}</p>
                </div>
                {expChanges.length > 0 && (
                  <Badge variant="outline" className={getBadgeStyles("purple")}>
                    {expChanges.length} change{expChanges.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              {isExpanded ? (
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-3">
                  {exp.responsibilities.map((bullet, bulletIndex) => {
                    const bulletChange = expChanges.find(
                      (c) => c.field === `responsibility_${expIndex}_${bulletIndex}`
                    );
                    const isModified = bulletChange?.changeType === "modified";
                    const isAdded = bulletChange?.changeType === "added";

                    return (
                      <li
                        key={bulletIndex}
                        className={`px-3 py-2 rounded transition-all ${
                          isModified
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-l-4 border-yellow-400 dark:border-yellow-600"
                            : isAdded
                              ? "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-l-4 border-green-400 dark:border-green-600"
                              : "bg-background"
                        }`}
                      >
                        {bulletChange
                          ? highlightText(
                              bullet,
                              expChanges,
                              `responsibility_${expIndex}_${bulletIndex}`
                            )
                          : bullet}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                  {exp.responsibilities.slice(0, 2).map((bullet, idx) => (
                    <li key={idx} className="line-clamp-1">
                      {bullet}
                    </li>
                  ))}
                  {exp.responsibilities.length > 2 && (
                    <li className="text-muted-foreground text-xs">
                      +{exp.responsibilities.length - 2} more
                    </li>
                  )}
                </ul>
              )}
              {viewMode === "split" && expChanges.length > 0 && (
                <button
                  onClick={() => onToggle(`work_${expIndex}`)}
                  className="text-primary text-xs mt-2 hover:underline font-medium"
                >
                  {isExpanded ? "▼ Show less" : "▶ Show more"}
                </button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </SectionWrapper>
  );
};
