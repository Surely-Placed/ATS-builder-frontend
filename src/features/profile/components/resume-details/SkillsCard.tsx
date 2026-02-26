import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface SkillsCardProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export const SkillsCard = ({ skills, onChange }: SkillsCardProps) => {
  const value = skills.join("\n");
  const handleChange = (raw: string) => {
    onChange(raw.split("\n"));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>List your core skills, one per line or comma-separated.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Textarea
            id="skills"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="TypeScript&#10;React&#10;Node.js&#10;PostgreSQL"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};
