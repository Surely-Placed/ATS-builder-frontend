import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export interface EducationItem {
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
}

export interface EducationCardProps {
  education: EducationItem[];
  onChange: (education: EducationItem[]) => void;
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

const emptyEducationItem = (): EducationItem => ({
  institution: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: null,
});

export const EducationCard = ({ education, onChange }: EducationCardProps) => {
  const add = () => onChange([...education, emptyEducationItem()]);
  const remove = (index: number) => onChange(education.filter((_, i) => i !== index));
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...education];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };
  const moveDown = (index: number) => {
    if (index >= education.length - 1) return;
    const next = [...education];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };
  const update = (index: number, patch: Partial<EducationItem>) => {
    const next = [...education];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Education</CardTitle>
            <CardDescription>
              Institution, degree, field of study. Dates in MM/YYYY.
            </CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="h-4 w-4 mr-1" />
            Add education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No education added yet. Click &quot;Add education&quot; to add an entry.
          </p>
        )}
        {education.map((edu, index) => (
          <div key={index} className="border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Education {index + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <Button type="button" variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} title="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === education.length - 1} title="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={education.length <= 1}
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => update(index, { institution: e.target.value })}
                  placeholder="University name"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => update(index, { degree: e.target.value })}
                  placeholder="B.Sc., M.A., etc."
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Field of study</Label>
                <Input
                  value={edu.field_of_study}
                  onChange={(e) => update(index, { field_of_study: e.target.value })}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start date (Month / Year)</Label>
                <div className="flex gap-2">
                  <Select
                    value={edu.start_date ? edu.start_date.slice(5, 7) : ""}
                    onValueChange={(month) => {
                      const year = edu.start_date ? edu.start_date.slice(0, 4) : String(CURRENT_YEAR);
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
                    value={edu.start_date ? edu.start_date.slice(0, 4) : ""}
                    onValueChange={(year) => {
                      const month = edu.start_date ? edu.start_date.slice(5, 7) : "01";
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
                    value={edu.end_date ? edu.end_date.slice(5, 7) : ""}
                    onValueChange={(month) => {
                      if (!edu.end_date) {
                        const year = String(CURRENT_YEAR);
                        update(index, { end_date: `${year}-${month}-01` });
                        return;
                      }
                      const year = edu.end_date.slice(0, 4);
                      update(index, { end_date: `${year}-${month}-01` });
                    }}
                    disabled={edu.end_date === null}
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
                    value={edu.end_date === null ? "present" : edu.end_date ? edu.end_date.slice(0, 4) : ""}
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
                        edu.end_date && edu.end_date.length >= 7
                          ? edu.end_date.slice(5, 7)
                          : "01";
                      update(index, { end_date: `${yearOrPresent}-${month}-01` });
                    }}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={edu.end_date === null ? "Present" : "Year"} />
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
