import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { getBadgeStyles, highlightText } from "@/utils/resume/preview";

interface CertificationsSectionProps {
  resume: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  resume,
  changes,
  isExpanded,
  viewMode,
  onToggle,
}) => {
  if (resume.certifications.length === 0) return null;

  const certificationsToShow = isExpanded ? resume.certifications : resume.certifications.slice(0, 3);
  const hasMoreCertifications = resume.certifications.length > 3;
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
                    {nameChange ? highlightText(cert.name, certChanges, "name") : cert.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {issuerChange ? highlightText(cert.issuer, certChanges, "issuer") : cert.issuer}
                    {" • "}
                    {dateChange ? highlightText(cert.date, certChanges, "date") : cert.date}
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
          {isExpanded ? "▼ Show less" : `▶ Show more (${resume.certifications.length - 3} more)`}
        </button>
      )}
    </SectionWrapper>
  );
};
