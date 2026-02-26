import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ExperienceItem {
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string[];
}

export interface ExperienceCardProps {
  experience: ExperienceItem[];
  onChange: (experience: ExperienceItem[]) => void;
}

const MONTH_OPTIONS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) => String(CURRENT_YEAR - i));

const emptyExperienceItem = (): ExperienceItem => ({
  company: "",
  role: "",
  start_date: "",
  end_date: null,
  description: [],
});

export const ExperienceCard = ({ experience, onChange }: ExperienceCardProps) => {
  const add = () => onChange([...experience, emptyExperienceItem()]);
  const remove = (index: number) => onChange(experience.filter((_, i) => i !== index));
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...experience];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };
  const moveDown = (index: number) => {
    if (index >= experience.length - 1) return;
    const next = [...experience];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };
  const update = (index: number, patch: Partial<ExperienceItem>) => {
    const next = [...experience];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Experience <span className="text-destructive text-sm font-normal">* at least one</span></CardTitle>
            <CardDescription>
              At least one experience with company and role is required. Dates in MM/YYYY. In Description, press Enter to add new lines (one bullet per line).
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="h-4 w-4 mr-1" />
            Add experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No experience added yet. Click &quot;Add experience&quot; to add a role.
          </p>
        )}
        {experience.map((exp, index) => (
          <div key={index} className="border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Experience {index + 1}</span>
              <div className="flex items-center gap-0.5">
                <Button type="button" variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} title="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === experience.length - 1} title="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={experience.length <= 1}
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => update(index, { company: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Role</Label>
                <Input value={exp.role} onChange={(e) => update(index, { role: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start date (Month / Year)</Label>
                <div className="flex gap-2">
                  <Select
                    value={exp.start_date ? exp.start_date.slice(5, 7) : ""}
                    onValueChange={(month) => {
                      const year = exp.start_date ? exp.start_date.slice(0, 4) : String(CURRENT_YEAR);
                      update(index, {
                        start_date: `${year}-${month}-01`,
                      });
                    }}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={exp.start_date ? exp.start_date.slice(0, 4) : ""}
                    onValueChange={(year) => {
                      const month = exp.start_date ? exp.start_date.slice(5, 7) : "01";
                      update(index, {
                        start_date: `${year}-${month}-01`,
                      });
                    }}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEAR_OPTIONS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End date (Month / Year or blank for Present)</Label>
                <div className="flex gap-2">
                  <Select
                    value={exp.end_date ? exp.end_date.slice(5, 7) : ""}
                    onValueChange={(month) => {
                      if (!exp.end_date) {
                        const year = String(CURRENT_YEAR);
                        update(index, { end_date: `${year}-${month}-01` });
                        return;
                      }
                      const year = exp.end_date.slice(0, 4);
                      update(index, { end_date: `${year}-${month}-01` });
                    }}
                    disabled={exp.end_date === null}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={exp.end_date === null ? "present" : exp.end_date ? exp.end_date.slice(0, 4) : ""}
                    onValueChange={(yearOrPresent) => {
                      if (yearOrPresent === "present") {
                        update(index, { end_date: null });
                        return;
                      }
                      if (!yearOrPresent) {
                        update(index, { end_date: null });
                        return;
                      }
                      const month =
                        exp.end_date && exp.end_date.length >= 7
                          ? exp.end_date.slice(5, 7)
                          : "01";
                      update(index, { end_date: `${yearOrPresent}-${month}-01` });
                    }}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={exp.end_date === null ? "Present" : "Year"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      {YEAR_OPTIONS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={(exp.description || []).join("\n")}
                onChange={(e) =>
                  update(index, {
                    description: e.target.value.split("\n"),
                  })
                }
                placeholder="- Led X...&#10;- Improved Y..."
                rows={4}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
