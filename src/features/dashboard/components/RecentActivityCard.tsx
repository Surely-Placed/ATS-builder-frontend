import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DashboardActivityItem } from "@/types/dashboard.types";
import { Clock, TrendingUp, Eye, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DownloadService } from "@/features/analysis/services/downloadService";
import { V2AnalysisService } from "@/features/analysis/services/v2AnalysisService";
import { useToast } from "@/hooks/use-toast";

/** -only activity item; score/status are optional (legacy data not used) */
type ActivityItem = DashboardActivityItem & {
  status?: string;
  atsScoreBefore?: number | null;
  atsScoreAfter?: number | null;
  scoreImprovement?: number | null;
};

interface RecentActivityCardProps {
  activity: ActivityItem;
}

export const RecentActivityCard = ({ activity }: RecentActivityCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const hasScores =
    activity.atsScore != null ||
    activity.atsScoreAfter != null ||
    activity.atsScoreBefore != null;
  const finalScore =
    activity.atsScoreAfter ?? activity.atsScoreBefore ?? activity.atsScore ?? null;

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "completed":
      case "complete":
      case "optimization_completed":
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

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const pdf = await V2AnalysisService.generatePdf(activity.id);

      if (!pdf.url) {
        throw new Error("Download URL not available");
      }

      DownloadService.downloadResume(pdf.url, "optimized-resume.pdf", activity.id);
      
      toast({
        title: "Download Started",
        description: "Your optimized resume is downloading.",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not download the resume. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base sm:text-lg font-semibold flex-1 line-clamp-1" title={activity.jobTitle}>
              {activity.jobTitle}
            </h3>
            {activity.status != null && activity.status !== "" && (
              <Badge variant={getStatusVariant(activity.status)} className="shrink-0">
                {activity.status}
              </Badge>
            )}
          </div>

          {/* ATS Score hidden for now
          {hasScores && (
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">ATS Score</span>
                <span className="text-xl sm:text-2xl font-bold">
                  {finalScore !== null && finalScore !== undefined ? finalScore : "—"}
                </span>
              </div>
              {activity.atsScoreAfter != null &&
                activity.atsScoreBefore != null && (
                  <div className="flex items-center gap-2 ml-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Improved from {activity.atsScoreBefore}
                      {activity.scoreImprovement != null && activity.scoreImprovement > 0
                        ? ` (+${activity.scoreImprovement})`
                        : ""}
                    </span>
                  </div>
                )}
            </div>
          )}
          */}

          {/* Footer with Actions */}
          <div className="flex items-center justify-between pt-2 border-t mt-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{formatDate(activity.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-muted-foreground hover:text-foreground"
                onClick={() => navigate(`/analysis/${activity.id}`)}
                title="View results"
              >
                <Eye className="w-4 h-4 mr-1" />
                View results
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleDownload}
                disabled={isDownloading}
                title="Download Resume"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
