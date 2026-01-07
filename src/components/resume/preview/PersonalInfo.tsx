import React from "react";
import type { ResumeStructure } from "@/types/resume/preview";

interface PersonalInfoProps {
  resume: ResumeStructure;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ resume }) => (
  <div className="mb-6 p-4 bg-muted rounded-lg">
    <h3 className="text-xl font-bold text-foreground mb-2">{resume.personal_info.name}</h3>
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      <span>📧 {resume.personal_info.email}</span>
      <span>📱 {resume.personal_info.phone}</span>
      {resume.personal_info.location && <span>📍 {resume.personal_info.location}</span>}
      {resume.personal_info.linkedin && <span>🔗 LinkedIn</span>}
    </div>
  </div>
);
