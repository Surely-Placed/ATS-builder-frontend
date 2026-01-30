import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIInsightsProps {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const AIInsights = ({ strengths, weaknesses, recommendations }: AIInsightsProps) => {
  const hasInsights = strengths.length > 0 || weaknesses.length > 0 || recommendations.length > 0;

  if (!hasInsights) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="insights-grid">
          <div className="insight-card strengths">
            <h3> Strengths</h3>
            {strengths.length > 0 ? (
              <ul>
                {strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No specific strengths identified.</p>
            )}
          </div>

          <div className="insight-card weaknesses">
            <h3> Weaknesses</h3>
            {weaknesses.length > 0 ? (
              <ul>
                {weaknesses.map((weakness, idx) => (
                  <li key={idx}>{weakness}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No major weaknesses identified.</p>
            )}
          </div>

          <div className="insight-card recommendations">
            <h3>💡 Recommendations</h3>
            {recommendations.length > 0 ? (
              <ul>
                {recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No specific recommendations at this time.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
