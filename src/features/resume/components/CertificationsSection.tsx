import React, { useState } from "react";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBadgeStyles } from "@/utils/resume/preview";

interface CertificationsSectionProps {
  resume: ResumeStructure;
  originalResume?: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  resume,
  originalResume,
  changes,
  isExpanded,
  viewMode,
  onToggle,
}) => {
  const certifications = resume.certifications || [];
  if (certifications.length === 0) return null;

  const certificationsToShow = isExpanded ? certifications : certifications.slice(0, 3);
  const hasMoreCertifications = certifications.length > 3;
  const hasChanges = changes.length > 0;

  return (
    <SectionWrapper sectionKey="certifications" changes={changes}>
      <SectionHeader title="Certifications" sectionKey="certifications" changes={changes} />
      {certificationsToShow.map((cert, certIndex) => {
        const certChanges = changes.filter((c) => c.location?.index === certIndex);
        const nameChange = certChanges.find((c) => c.field === "name");
        const issuerChange = certChanges.find((c) => c.field === "issuer");
        const dateChange = certChanges.find((c) => c.field === "date");
        const hasAnyChange = certChanges.length > 0;

        return (
          <Card key={certIndex} className="mb-2">
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {nameChange ? (
                      <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                        {cert.name}
                      </span>
                    ) : (
                      cert.name
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {issuerChange ? (
                      <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                        {cert.issuer}
                      </span>
                    ) : (
                      cert.issuer
                    )}
                    {" • "}
                    {dateChange ? (
                      <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                        {cert.date}
                      </span>
                    ) : (
                      cert.date
                    )}
                  </p>
                </div>
                {hasAnyChange && (
                  <Badge variant="outline" className={getBadgeStyles("purple")}>
                    {certChanges.length}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      {viewMode === "split" && (hasMoreCertifications || hasChanges) && (
        <button
          onClick={onToggle}
          className="text-primary text-xs mt-2 hover:underline font-medium"
        >
          {isExpanded ? "▼ Show less" : `▶ Show more (${certifications.length - 3} more)`}
        </button>
      )}
    </SectionWrapper>
  );
};
