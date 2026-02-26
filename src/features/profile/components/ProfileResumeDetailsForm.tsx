import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResumeDetailsService } from "@/features/profile/resumeDetailsService";
import type { UserResumeDetailInput } from "@/features/analysis/services/v2Types";
import {
  EMPTY_RESUME_DETAILS,
  BasicInfoCard,
  SkillsCard,
  ExperienceCard,
  AchievementsCard,
  ProjectsCard,
  EducationCard,
  normalizeAchievements,
  achievementsForSubmit,
} from "./resume-details";

const RESUME_UPDATE_NOTE =
  "You can update your resume details anytime from Profile → Resume.";

/** Validates required fields: name, email, and at least one experience with company & role. */
function validateResumeForm(form: UserResumeDetailInput): string | null {
  const name = form.professional_name?.trim() ?? "";
  const email = form.professional_email?.trim() ?? "";
  if (!name) return "Professional name is required.";
  if (!email) return "Professional email is required.";
  const exp = form.experience ?? [];
  if (exp.length === 0) return "At least one experience entry is required.";
  const first = exp[0];
  const company = (first.company ?? "").trim();
  const role = (first.role ?? "").trim();
  if (!company || !role) return "First experience must have company and role.";
  return null;
}

/** Returns true only when saved details have required fields filled (name, email, at least one experience with company & role). */
export function isResumeDetailsComplete(details: UserResumeDetailInput | null): boolean {
  if (!details) return false;
  return validateResumeForm(details) === null;
}

export interface ProfileResumeDetailsFormProps {
  /** Called after a successful save (e.g. to show analysis form when embedded in Resume Analysis). */
  onSaveSuccess?: () => void;
}

export const ProfileResumeDetailsForm = ({ onSaveSuccess }: ProfileResumeDetailsFormProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<UserResumeDetailInput>(EMPTY_RESUME_DETAILS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await ResumeDetailsService.getDetails();
        if (data) {
          setForm({
            ...EMPTY_RESUME_DETAILS,
            ...data,
            skills: data.skills ?? [],
            experience: data.experience ?? [],
            achievements: normalizeAchievements(data.achievements),
            projects: data.projects ?? [],
            eduction: data.eduction ?? [],
          });
        } else {
          setForm(EMPTY_RESUME_DETAILS);
        }
      } catch (error: unknown) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load resume details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const handleBasicChange = (field: keyof UserResumeDetailInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const err = validateResumeForm(form);
    if (err) {
      toast({
        title: "Cannot save",
        description: err,
        variant: "destructive",
      });
      return;
    }
    try {
      setSaving(true);
      const payload: UserResumeDetailInput = {
        ...form,
        achievements: achievementsForSubmit(form.achievements ?? []),
      };
      await ResumeDetailsService.saveDetails(payload);
      toast({
        title: "Resume details saved",
        description: `Your profile resume details have been updated. ${RESUME_UPDATE_NOTE}`,
      });
      onSaveSuccess?.();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save resume details",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading resume details...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <BasicInfoCard
        professional_name={form.professional_name}
        professional_email={form.professional_email}
        professional_phone={form.professional_phone}
        linkedIn_url={form.linkedIn_url ?? ""}
        github_url={form.github_url ?? ""}
        onFieldChange={(field, value) => handleBasicChange(field as keyof UserResumeDetailInput, value)}
      />

      <SkillsCard skills={form.skills} onChange={(skills) => setForm((prev) => ({ ...prev, skills }))} />

      <ExperienceCard
        experience={form.experience}
        onChange={(experience) => setForm((prev) => ({ ...prev, experience }))}
      />

      <AchievementsCard
        achievements={form.achievements ?? []}
        onChange={(achievements) => setForm((prev) => ({ ...prev, achievements }))}
      />

      <ProjectsCard
        projects={form.projects ?? []}
        onChange={(projects) => setForm((prev) => ({ ...prev, projects }))}
      />

      <EducationCard
        education={form.eduction ?? []}
        onChange={(eduction) => setForm((prev) => ({ ...prev, eduction }))}
      />

      <Card>
        <CardContent className="p-4 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Resume Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
