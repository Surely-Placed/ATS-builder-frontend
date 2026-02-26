import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export interface ProjectItem {
  name: string;
  description: string;
  link: string;
  year: number;
}

export interface ProjectsCardProps {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
}

const emptyProjectItem = (): ProjectItem => ({
  name: "",
  description: "",
  link: "",
  year: new Date().getFullYear(),
});

export const ProjectsCard = ({ projects, onChange }: ProjectsCardProps) => {
  const add = () => onChange([...projects, emptyProjectItem()]);
  const remove = (index: number) => onChange(projects.filter((_, i) => i !== index));
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...projects];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };
  const moveDown = (index: number) => {
    if (index >= projects.length - 1) return;
    const next = [...projects];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };
  const update = (index: number, patch: Partial<ProjectItem>) => {
    const next = [...projects];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Project name, year, link, and description. In Description, press Enter for new lines.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="h-4 w-4 mr-1" />
            Add project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects added yet. Click &quot;Add project&quot; to add one.
          </p>
        )}
        {projects.map((proj, index) => (
          <div key={index} className="border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Project {index + 1}</span>
              <div className="flex items-center gap-0.5">
                <Button type="button" variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} title="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === projects.length - 1} title="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} title="Remove">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Project name</Label>
                <Input
                  value={proj.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Year</Label>
                <Input
                  type="number"
                  min={1900}
                  max={3000}
                  value={proj.year ?? new Date().getFullYear()}
                  onChange={(e) =>
                    update(index, {
                      year: Number(e.target.value) || new Date().getFullYear(),
                    })
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Link</Label>
                <Input
                  value={proj.link ?? ""}
                  onChange={(e) => update(index, { link: e.target.value })}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={proj.description ?? ""}
                onChange={(e) => update(index, { description: e.target.value })}
                placeholder="Short description of what you built and the impact."
                rows={4}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
