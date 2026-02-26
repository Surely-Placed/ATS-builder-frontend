import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface BasicInfoCardProps {
  professional_name: string;
  professional_email: string;
  professional_phone: string;
  linkedIn_url: string;
  github_url: string;
  onFieldChange: (field: string, value: string) => void;
}

export const BasicInfoCard = ({
  professional_name,
  professional_email,
  professional_phone,
  linkedIn_url,
  github_url,
  onFieldChange,
}: BasicInfoCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Basic information</CardTitle>
      <CardDescription>Your contact and profile links</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="professional_name">Professional name <span className="text-destructive">*</span></Label>
          <Input
            id="professional_name"
            value={professional_name}
            onChange={(e) => onFieldChange("professional_name", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="professional_email">Professional email <span className="text-destructive">*</span></Label>
          <Input
            id="professional_email"
            type="email"
            value={professional_email}
            onChange={(e) => onFieldChange("professional_email", e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="professional_phone">Professional phone</Label>
          <Input
            id="professional_phone"
            value={professional_phone}
            onChange={(e) => onFieldChange("professional_phone", e.target.value)}
            placeholder="+1 (555) 555-5555"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedIn_url">LinkedIn URL</Label>
          <Input
            id="linkedIn_url"
            value={linkedIn_url}
            onChange={(e) => onFieldChange("linkedIn_url", e.target.value)}
            placeholder="https://www.linkedin.com/in/username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            value={github_url}
            onChange={(e) => onFieldChange("github_url", e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>
      </div>
    </CardContent>
  </Card>
);
