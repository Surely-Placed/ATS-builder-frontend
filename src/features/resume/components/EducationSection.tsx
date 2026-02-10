import React, { useState } from "react";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBadgeStyles } from "@/utils/resume/preview";

interface EducationSectionProps {
  resume: ResumeStructure;
  originalResume?: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  resume,
  originalResume,
  changes,
  isExpanded,
  viewMode,
  onToggle,
}) => {
  const education = resume.education || [];
  const educationToShow = isExpanded ? education : education.slice(0, 2);
  const hasMoreEducation = education.length > 2;
  const hasChanges = changes.length > 0;

  return (
    <SectionWrapper sectionKey="education" changes={changes}>
      <SectionHeader title="Education" sectionKey="education" changes={changes} />
      {educationToShow.map((edu, eduIndex) => {
        const eduChanges = changes.filter((c) => c.location?.index === eduIndex);
        const degreeChange = eduChanges.find((c) => c.field === "degree");
        const institutionChange = eduChanges.find((c) => c.field === "institution");
        const datesChange = eduChanges.find((c) => c.field === "dates");
        const gpaChange = eduChanges.find((c) => c.field === "gpa");
        const hasAnyChange = eduChanges.length > 0;

        return (
          <Card key={eduIndex} className="mb-3">
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-foreground">
                  {degreeChange ? (
                    <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                      {edu.degree}
                    </span>
                  ) : (
                    edu.degree
                  )}
                </h4>
                {hasAnyChange && (
                  <Badge variant="outline" className={getBadgeStyles("purple")}>
                    {eduChanges.length} change{eduChanges.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {institutionChange ? (
                  <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                    {edu.institution}
                  </span>
                ) : (
                  edu.institution
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {datesChange ? (
                  <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                    {edu.dates}
                  </span>
                ) : (
                  edu.dates
                )}
              </p>
              {edu.gpa && (
                <p className="text-xs text-muted-foreground">
                  GPA: {gpaChange ? (
                    <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                      {edu.gpa}
                    </span>
                  ) : (
                    edu.gpa
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
      {viewMode === "split" && (hasMoreEducation || hasChanges) && (
        <button
          onClick={onToggle}
          className="text-primary text-xs mt-2 hover:underline font-medium"
        >
          {isExpanded ? "▼ Show less" : `▶ Show more (${education.length - 2} more)`}
        </button>
      )}
    </SectionWrapper>
  );
};
