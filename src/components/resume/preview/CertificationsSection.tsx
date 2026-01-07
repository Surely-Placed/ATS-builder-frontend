import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeStructure, ChangeHighlight } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";

interface CertificationsSectionProps {
  resume: ResumeStructure;
  changes: ChangeHighlight[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  resume,
  changes,
}) => {
  if (resume.certifications.length === 0) return null;

  return (
    <SectionWrapper sectionKey="certifications" changes={changes}>
      <SectionHeader title="Certifications" sectionKey="certifications" changes={changes} />
      {resume.certifications.map((cert, certIndex) => (
        <Card key={certIndex} className="mb-2">
          <CardContent className="p-3">
            <p className="text-sm font-medium text-foreground">{cert.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {cert.issuer} • {cert.date}
            </p>
          </CardContent>
        </Card>
      ))}
    </SectionWrapper>
  );
};
