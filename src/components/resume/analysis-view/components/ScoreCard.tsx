import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getScoreLevel } from "../utils/scoreUtils";

interface ScoreCardProps {
  score: number;
}

export const ScoreCard = ({ score }: ScoreCardProps) => {
  return (
    <Card className="score-card">
      <CardHeader>
        <div className="score-header">
          <CardTitle>Current ATS Score</CardTitle>
          <Badge className={`score-badge score-${getScoreLevel(score)}`}>{score}/100</Badge>
        </div>
      </CardHeader>
    </Card>
  );
};
