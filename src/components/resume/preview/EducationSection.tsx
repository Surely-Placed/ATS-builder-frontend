import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { ResumeStructure, ChangeHighlight } from '@/types/resume/preview';
import { SectionWrapper } from './SectionWrapper';
import { SectionHeader } from './SectionHeader';

interface EducationSectionProps {
  resume: ResumeStructure;
  changes: ChangeHighlight[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ resume, changes }) => {
  return (
    <SectionWrapper sectionKey="education" changes={changes}>
      <SectionHeader title="Education" sectionKey="education" changes={changes} />
      {resume.education.map((edu, eduIndex) => (
        <Card key={eduIndex} className="mb-3">
          <CardContent className="p-3">
            <h4 className="font-semibold text-foreground">{edu.degree}</h4>
            <p className="text-sm text-muted-foreground">{edu.institution}</p>
            <p className="text-xs text-muted-foreground mt-1">{edu.dates}</p>
            {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
          </CardContent>
        </Card>
      ))}
    </SectionWrapper>
  );
};

