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
                    // Find the responsibilities change for this work experience
                    const responsibilitiesChange = expChanges.find(
                      (c) => c.field === "responsibilities"
                    );
                    
                    // Check if this specific bullet was modified by comparing with original
                    let isModified = false;
                    let isAdded = false;
                    
                    if (responsibilitiesChange) {
                      const originalBullets = responsibilitiesChange.original as string[] || [];
                      const optimizedBullets = responsibilitiesChange.optimized as string[] || [];
                      
                      // Check if this bullet exists in original and is different
                      if (bulletIndex < originalBullets.length) {
                        isModified = originalBullets[bulletIndex] !== optimizedBullets[bulletIndex];
                      } else {
                        // Bullet is new (added)
                        isAdded = true;
                      }
                    }

                    return (
                      <li key={bulletIndex} className="px-3 py-2 rounded">
                        {(isModified || isAdded) ? highlightText(bullet, expChanges, "responsibilities") : bullet}
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
