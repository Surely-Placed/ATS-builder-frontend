import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResumeDetailsService } from "@/features/profile/resumeDetailsService";
import { V2AnalysisService } from "@/features/analysis/services/v2AnalysisService";
import type { AnalysisDetail, PdfResult } from "@/features/analysis/services/v2Types";
import { stripMarkdownAsterisks, parseExperienceBullets, collapseNewlines, parseSkillsList } from "@/utils/text";

function normalizeDetail(d: AnalysisDetail) {
  return {
    improvedSummary: d.improvedSummary ?? d.improved_summary ?? d.summary ?? "",
    improvedExperience: Array.isArray(d.improvedExperience)
      ? d.improvedExperience
      : Array.isArray(d.improved_experience)
        ? d.improved_experience
        : [],
    improvedSkills: d.improvedSkills ?? d.improved_skills ?? "",
    analysisId: d.analysisId ?? d.id,
    jobTitle: d.jobTitle ?? d.job_title ?? "",
  };
}

export default function ViewAnalysis() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ReturnType<typeof normalizeDetail> | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfResult, setPdfResult] = useState<PdfResult | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Analysis ID is missing");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await V2AnalysisService.getAnalysis(id);
        if (!cancelled) {
          setDetail(normalizeDetail(data));
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : "Failed to load analysis";
          setError(message);
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, toast]);

  const handleGeneratePdf = async () => {
    if (!detail || isGeneratingPdf) return;
    try {
      setIsGeneratingPdf(true);
      const jobTitle = detail.jobTitle ?? "";
      const [pdf, details] = await Promise.all([
        V2AnalysisService.generatePdf(detail.analysisId),
        ResumeDetailsService.getDetails().catch(() => null),
      ]);
      setPdfResult(pdf);
      const professionalName = details?.professional_name?.trim() || "";
      toast({
        title: "PDF ready",
        description: "Your optimized resume PDF has been generated.",
      });
      navigate("/resume-result", {
        state: { pdfResult: pdf, jobTitle, professionalName },
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to generate PDF";
      toast({
        title: "PDF generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeTab="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading analysis...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !detail) {
    return (
      <DashboardLayout activeTab="Dashboard">
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">{error ?? "Analysis not found."}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="Dashboard">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Review the suggested improvements for this analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {detail.improvedSummary && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Improved Summary</h3>
                <p className="text-sm whitespace-pre-line">
                  {stripMarkdownAsterisks(detail.improvedSummary)}
                </p>
              </section>
            )}

            {detail.improvedExperience.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Improved Experience</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {detail.improvedExperience.flatMap((line) =>
                    parseExperienceBullets(line).map((bullet) =>
                      collapseNewlines(stripMarkdownAsterisks(bullet))
                    )
                  ).filter(Boolean).map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </section>
            )}

            {detail.improvedSkills && (
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Improved Skills</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {parseSkillsList(stripMarkdownAsterisks(detail.improvedSkills)).map((skill, idx) => (
                    <li key={idx}>{collapseNewlines(skill)}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t mt-2">
              <div className="text-sm text-muted-foreground">
                Generate an optimized PDF.
              </div>
              <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                {isGeneratingPdf ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                Generate PDF
              </Button>
            </div>

            {/* ATS Score hidden for now
            {pdfResult && (
              <div className="mt-4 space-y-3 border-t pt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">ATS Score:</span>
                  <span className="text-2xl font-bold">{pdfResult.atsScore}</span>
                </div>
                <ul className="space-y-1 text-sm">
                  {(Array.isArray(pdfResult.atsBreakdown) ? pdfResult.atsBreakdown : []).map(
                    (item, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{item?.module ?? "—"}</span>: {item?.score ?? "—"}
                        {item?.feedback ? ` — ${item.feedback}` : ""}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
