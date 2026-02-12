import React, { useState } from "react";
import { ResumeWithStatus } from "@/features/resume/hooks/useResumeFilters";
import { getResumeUrl } from "@/utils/resumeUrlHelper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, TrendingUp, Sparkles, Clock } from "lucide-react";
import { DownloadService } from "@/features/analysis/services/downloadService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ResumeListProps {
  resumes: ResumeWithStatus[];
  loading: boolean;
}

export const ResumeList: React.FC<ResumeListProps> = ({ resumes, loading }) => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const s = status.toLowerCase();
    if (s === "optimization_completed" || s === "completed" || s === "complete") return "default";
    if (s === "optimization_pending" || s === "initial_processed" || s === "pending") return "secondary";
    if (s === "optimization_processing" || s === "processing" || s === "running") return "outline";
    if (s === "optimization_failed" || s === "initial_failed" || s === "failed") return "destructive";
    return "secondary";
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      optimization_completed: "Optimization completed",
      optimization_pending: "Optimization pending",
      optimization_processing: "Optimization in progress",
      optimization_failed: "Optimization failed",
      initial_processed: "Analysis done",
      initial_failed: "Not analyzed",
    };
    return labels[status] ?? status;
  };

  const handleDownloadOptimized = async (url: string, resumeId: string, filename: string) => {
    try {
      setDownloadingId(resumeId);
      await DownloadService.downloadResume(url, filename, resumeId);
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
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No resumes found in this category.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => {
        // Determine if optimized based on file URL OR having an after score
        const hasOptimized = !!resume.optimized_file_url || (resume.latestAnalysis?.atsScoreAfter !== null && resume.latestAnalysis?.atsScoreAfter !== undefined);
        const displayStatus =
          resume.latestAnalysis?.status ||
          (hasOptimized ? "optimization_completed" : resume.latestAnalysis ? "initial_processed" : "initial_failed");
        const mainTitle = resume.latestAnalysis?.jobTitle?.trim() || `Resume #${resume.id.substring(0, 8)}`;

        const optimizedUrl = resume.optimized_file_url
          ? getResumeUrl(
              {
                id: resume.id,
                optimized_file_url: resume.optimized_file_url,
              },
              { useProxy: true }
            )
          : null;

        return (
          <Card key={resume.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg line-clamp-1" title={mainTitle}>
                    {mainTitle}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    ID: {resume.id.substring(0, 8)}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={getStatusVariant(displayStatus)} className="shrink-0">
                    {getStatusLabel(displayStatus)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.latestAnalysis && (
                <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between border">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-muted-foreground">ATS Score:</span>
                     <span className="text-lg font-bold">{resume.latestAnalysis.atsScoreBefore}</span>
                  </div>
                  
                  {resume.latestAnalysis.atsScoreAfter !== null && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {resume.latestAnalysis.atsScoreAfter}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {/* Primary Action: Download Optimized / Resume Optimization / Start analysis */}
                {hasOptimized ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={async () => {
                      if (optimizedUrl) {
                        await handleDownloadOptimized(
                          optimizedUrl,
                          resume.id,
                          `optimized-resume-${resume.id.substring(0, 8)}.pdf`
                        );
                      } else if (resume.latestAnalysis?.id) {
                        // Lazy fetch URL if missing
                        try {
                          setDownloadingId(resume.id);
                          const { AnalysisService } = await import(
                            "@/features/analysis/services/analysisService"
                          );
                          const analysis = await AnalysisService.getAnalysis(
                            resume.latestAnalysis.id
                          );
                          const fetchedUrl =
                            analysis.optimized_resume?.file_url ||
                            analysis.analysis?.optimized_file_url ||
                            analysis.optimized_resume?.url;

                          if (fetchedUrl) {
                            const fullUrl = getResumeUrl(
                              { id: resume.id, optimized_file_url: fetchedUrl },
                              { useProxy: true }
                            );
                            if (fullUrl) {
                              await DownloadService.downloadResume(
                                fullUrl,
                                `optimized-resume-${resume.id.substring(0, 8)}.pdf`,
                                resume.id
                              );
                              toast({
                                title: "Download Started",
                                description: "Your optimized resume is downloading.",
                              });
                            } else {
                              throw new Error("Could not construct download URL");
                            }
                          } else {
                            throw new Error("No download URL found in analysis");
                          }
                        } catch (e) {
                          console.error("Lazy download failed", e);
                          toast({
                            variant: "destructive",
                            title: "Download Failed",
                            description: "Could not retrieve the optimized file.",
                          });
                        } finally {
                          setDownloadingId(null);
                        }
                      }
                    }}
                    disabled={downloadingId === resume.id}
                  >
                    {downloadingId === resume.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Download Optimized
                  </Button>
                ) : resume.latestAnalysis ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() =>
                      navigate(`/resume-analysis?analysisId=${resume.latestAnalysis?.id}`)
                    }
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Resume Optimization
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => navigate("/resume-analysis")}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start analysis
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground pt-3 border-t flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Uploaded on{" "}
                {new Date(resume.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
