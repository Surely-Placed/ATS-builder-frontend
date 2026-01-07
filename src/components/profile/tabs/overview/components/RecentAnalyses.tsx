import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { formatDateOverview } from "@/utils/profile/dateUtils";
import type { RecentAnalysis } from "@/types/profile/overview";

interface RecentAnalysesProps {
  analyses: RecentAnalysis[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const RecentAnalyses = ({ analyses, activeFilter, onFilterChange }: RecentAnalysesProps) => {
  return (
    <Card className="border rounded-xl shadow-sm">
      <CardContent className="p-6">
        {/* Header with Filters */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-foreground">Recent Analyses</h3>
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {["All", "This Week", "This Month"].map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeFilter === filter
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Analyses List */}
        {analyses.length > 0 ? (
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-1">{analysis.job_title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateOverview(analysis.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-muted-foreground">
                    {analysis.ats_score_before}
                  </span>
                  {analysis.ats_score_after && (
                    <>
                      <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {analysis.ats_score_after}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No analyses yet</p>
        )}
      </CardContent>
    </Card>
  );
};
