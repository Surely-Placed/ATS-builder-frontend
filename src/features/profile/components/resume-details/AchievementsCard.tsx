import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { AchievementItem } from "./achievements";

export type { AchievementItem };

export interface AchievementsCardProps {
  achievements: AchievementItem[];
  onChange: (achievements: AchievementItem[]) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));
const YEAR_NONE = "__none__"; // Radix Select forbids value=""

const emptyAchievement = (): AchievementItem => ({ description: "", year: "", link: "" });

export const AchievementsCard = ({ achievements, onChange }: AchievementsCardProps) => {
  const add = () => onChange([...achievements, emptyAchievement()]);
  const remove = (index: number) => onChange(achievements.filter((_, i) => i !== index));
  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...achievements];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };
  const moveDown = (index: number) => {
    if (index >= achievements.length - 1) return;
    const next = [...achievements];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };
  const update = (index: number, patch: Partial<AchievementItem>) => {
    const next = [...achievements];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Notable accomplishments and milestones (with optional year and link)</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="h-4 w-4 mr-1" />
            Add achievement
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No achievements added yet. Click &quot;Add achievement&quot; to add one.
          </p>
        )}
        {achievements.map((ach, index) => (
          <div key={index} className="border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">Achievement {index + 1}</span>
              <div className="flex items-center gap-0.5 shrink-0">
                <Button type="button" variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} title="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === achievements.length - 1} title="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} title="Remove">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input
                value={ach.description}
                onChange={(e) => update(index, { description: e.target.value })}
                placeholder="e.g. Increased conversion rate by 20%..."
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Year</Label>
                <Select
                  value={
                    ach.year != null && String(ach.year).trim() !== ""
                      ? String(ach.year)
                      : YEAR_NONE
                  }
                  onValueChange={(value) =>
                    update(index, { year: value === YEAR_NONE ? "" : value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={YEAR_NONE}>—</SelectItem>
                    {YEAR_OPTIONS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Link</Label>
                <Input
                  value={ach.link ?? ""}
                  onChange={(e) => update(index, { link: e.target.value })}
                  placeholder="https://..."
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
