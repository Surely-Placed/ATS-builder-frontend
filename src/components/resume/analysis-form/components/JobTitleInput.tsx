import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface JobTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const JobTitleInput = ({ value, onChange, disabled }: JobTitleInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="job-title">Job Title *</Label>
      <div className="relative">
        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id="job-title"
          placeholder="e.g., Senior Software Engineer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          disabled={disabled}
          required
        />
      </div>
    </div>
  );
};
