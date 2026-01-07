export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  dates: string;
  responsibilities: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  dates: string;
  gpa?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeStructure {
  personal_info: PersonalInfo;
  summary: string | null;
  skills: string[];
  work_experience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

export interface ChangeHighlight {
  section: string;
  field: string;
  original: string | string[] | null;
  optimized: string | string[] | null;
  changeType: "added" | "removed" | "modified" | "reordered";
  location?: { index?: number; line?: number };
}

export interface SectionChanges {
  section: string;
  hasChanges: boolean;
  changes: ChangeHighlight[];
}

export interface ResumeDiffResult {
  hasChanges: boolean;
  totalChanges: number;
  sections: SectionChanges[];
  summary: {
    sectionsModified: number;
    sectionsUnchanged: number;
  };
}

export interface ResumePreviewProps {
  originalResume: ResumeStructure;
  optimizedResume: ResumeStructure;
  changes: ResumeDiffResult;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isGenerating?: boolean;
}

export type ViewMode = "split" | "original" | "optimized";
