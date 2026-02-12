import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecentActivity } from "@/types/dashboard.types";
import { Clock, TrendingUp, Eye, Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnalysisService } from "@/features/analysis/services/analysisService";
import { DownloadService } from "@/features/analysis/services/downloadService";
import { useToast } from "@/hooks/use-toast";
import { useDashboardActions } from "@/features/dashboard/hooks/useDashboardActions";

interface RecentActivityCardProps {
  activity: RecentActivity;
}

export const RecentActivityCard = ({ activity }: RecentActivityCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleContinueOrOptimize } = useDashboardActions();
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleView = () => {
    navigate(`/resume-comparison?analysisId=${activity.id}`);
  };

  const handleContinue = () => {
    handleContinueOrOptimize({ analysisId: activity.id, status: activity.status });
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // New backend API may send optimizedFileUrl on activity; use it when present
      let pdfUrl = activity.optimizedFileUrl ?? null;

      if (!pdfUrl) {
        const result = await AnalysisService.getAnalysis(activity.id);
        pdfUrl =
          result?.optimized_resume?.file_url ||
          result?.optimized_resume?.url ||
          result?.optimized_resume?.pdf_url ||
          result?.analysis?.optimized_file_url ||
          null;
      }

      if (!pdfUrl) {
        try {
          const { default: AnalysisApiService } = await import('@/services/analysisApi');
          const genResponse = await AnalysisApiService.generatePDF(activity.id);
          if (genResponse.success && genResponse.file_url) pdfUrl = genResponse.file_url;
        } catch (genErr) {
          console.error("Failed to generate PDF on demand:", genErr);
        }
      }

      if (!pdfUrl) {
        throw new Error("Download URL not available");
      }

      DownloadService.downloadResume(pdfUrl, "optimized-resume.pdf", activity.id);

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

  // Check if optimization is successful/completed to show actions
  const isCompleted =
    activity.status.toLowerCase().includes('complete') ||
    (activity.atsScoreAfter !== null && activity.atsScoreAfter !== undefined);

  // Show "Continue" for any row with analysis id that is not yet completed
  const showContinue = !isCompleted && activity.id;

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base sm:text-lg font-semibold flex-1 line-clamp-1" title={activity.jobTitle}>
              {activity.jobTitle}
            </h3>
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

          {/* Footer with Actions */}
          <div className="flex items-center justify-between pt-2 border-t mt-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{formatDate(activity.createdAt)}</span>
            </div>

            {isCompleted ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleView}
                  title="View Comparison"
                >
                  <Eye className="w-4 h-4" />
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
            ) : showContinue ? (
              <Button
                size="sm"
                disabled={!activity.id}
                onClick={handleContinue}
              >
                Continue
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
