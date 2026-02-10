import React from "react";
import type { ResumeStructure } from "@/types/resume/preview";

interface PersonalInfoProps {
  resume: ResumeStructure;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ resume }) => {
  // Add null safety checks
  if (!resume?.personal_info) {
    return (
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="text-xl font-bold text-foreground mb-2">Personal Information Not Available</h3>
        <p className="text-sm text-muted-foreground">Unable to load personal information</p>
      </div>
    );
  }

  const { name, email, phone, location, linkedin } = resume.personal_info;

  return (
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <h3 className="text-xl font-bold text-foreground mb-2">{name || 'Name Not Available'}</h3>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {email && <span>📧 {email}</span>}
        {phone && <span>📱 {phone}</span>}
        {location && <span>📍 {location}</span>}
        {linkedin && <span>🔗 LinkedIn</span>}
      </div>
    </div>
  );
};
