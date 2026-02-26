import type { UserResumeDetailInput } from "@/features/analysis/services/v2Types";

export const EMPTY_RESUME_DETAILS: UserResumeDetailInput = {
  professional_name: "",
  professional_email: "",
  professional_phone: "",
  linkedIn_url: "",
  github_url: "",
  skills: [],
  experience: [],
  achievements: [],
  projects: [],
  eduction: [],
};
