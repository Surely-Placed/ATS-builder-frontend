import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const JobDescriptionInput = ({ value, onChange, disabled }: JobDescriptionInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="job-description">Job Description *</Label>
      <Textarea
        id="job-description"
        placeholder="Paste the complete job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        disabled={disabled}
        required
      />
      <p className="text-xs text-muted-foreground">
        {value.length} characters
        {value.length < 50 && ` (minimum 50 required)`}
      </p>
    </div>
  );
};
