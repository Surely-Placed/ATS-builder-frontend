import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { OptimizationResult } from "@/features/analysis/services/types";

interface ImprovementsListProps {
  improvements: string[];
}

export const ImprovementsList: React.FC<ImprovementsListProps> = ({ 
  improvements 
}) => {
  if (!improvements || improvements.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Improvements Made</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="improvements-list">
          {improvements.map((text, idx) => (
            <li key={`${idx}-${text}`} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};