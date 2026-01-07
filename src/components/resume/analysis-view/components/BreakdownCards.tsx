import { Card, CardContent } from "@/components/ui/card";
import { getBreakdownColorClass } from "../utils/scoreUtils";

interface Breakdown {
  keyword_match: number;
  experience_relevance: number;
  education_match: number;
  structure_quality: number;
}

interface BreakdownCardsProps {
  breakdown: Breakdown | null | undefined;
}

export const BreakdownCards = ({ breakdown }: BreakdownCardsProps) => {
  if (!breakdown) return null;

  const keywordMatch = breakdown.keyword_match ?? 0;
  const experienceRelevance = breakdown.experience_relevance ?? 0;
  const educationMatch = breakdown.education_match ?? 0;
  const structureQuality = breakdown.structure_quality ?? 0;

  return (
    <div className="breakdown-cards-row">
      <Card className={`breakdown-card breakdown-${getBreakdownColorClass(keywordMatch)}`}>
        <CardContent className="pt-6">
          <div className="breakdown-item-content">
            <span className="label">Keyword Match</span>
            <span className="value">{keywordMatch}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className={`breakdown-card breakdown-${getBreakdownColorClass(experienceRelevance)}`}>
        <CardContent className="pt-6">
          <div className="breakdown-item-content">
            <span className="label">Experience Relevance</span>
            <span className="value">{experienceRelevance}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className={`breakdown-card breakdown-${getBreakdownColorClass(educationMatch)}`}>
        <CardContent className="pt-6">
          <div className="breakdown-item-content">
            <span className="label">Education Match</span>
            <span className="value">{educationMatch}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className={`breakdown-card breakdown-${getBreakdownColorClass(structureQuality)}`}>
        <CardContent className="pt-6">
          <div className="breakdown-item-content">
            <span className="label">Structure Quality</span>
            <span className="value">{structureQuality}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
