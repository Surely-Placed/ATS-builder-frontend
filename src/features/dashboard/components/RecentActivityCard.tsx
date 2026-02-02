import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecentActivity } from "@/types/dashboard.types";
import { Clock, TrendingUp } from "lucide-react";

interface RecentActivityCardProps {
  activity: RecentActivity;
}

export const RecentActivityCard = ({ activity }: RecentActivityCardProps) => {
  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "completed":
      case "complete":
        return "default";
      case "pending":
        return "secondary";
      case "processing":
      case "running":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base sm:text-lg font-semibold flex-1">{activity.jobTitle}</h3>
            <Badge variant={getStatusVariant(activity.status)} className="shrink-0">
              {activity.status}
            </Badge>
          </div>

          {/* Scores - Show Before and After if available */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Before</span>
              <span className="text-xl sm:text-2xl font-bold">{activity.atsScoreBefore}</span>
            </div>

            {/* Show After score only if it exists (optimization completed) */}
            {activity.atsScoreAfter !== null && activity.atsScoreAfter !== undefined && (
              <>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">After</span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                    {activity.atsScoreAfter}
                  </span>
                </div>

                {activity.scoreImprovement !== null && activity.scoreImprovement > 0 && (
                  <div className="ml-auto">
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      +{activity.scoreImprovement}
                    </Badge>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-2 border-t">
            <Clock className="w-4 h-4" />
            <span>{formatDate(activity.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
