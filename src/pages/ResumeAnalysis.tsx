import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUsage } from "@/context/UsageContext";
import { ResumeDetailsService } from "@/features/profile/resumeDetailsService";
import { isResumeDetailsComplete } from "@/features/profile/components/ProfileResumeDetailsForm";
import { V2AnalysisService } from "@/features/analysis/services/v2AnalysisService";
import type { AnalyzeResult, PdfResult } from "@/features/analysis/services/v2Types";
import { stripMarkdownAsterisks, parseExperienceBullets, collapseNewlines, parseSkillsList } from "@/utils/text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ANALYSIS_STEPS = [
  "Analyzing your saved resume details",
  "Analyzing job title & description",
  "Generating improved summary",
  "Improving skills alignment",
  "Improving experience section",
  "Improving projects section",
];

export default function ResumeAnalysis() {
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [hasDetails, setHasDetails] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfResult, setPdfResult] = useState<PdfResult | null>(null);

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const analysisIntervalRef = useRef<number | null>(null);
  const analysisStepIndexRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { toast } = useToast();
  const { refresh: refreshUsage } = useUsage();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoadingDetails(true);
        const details = await ResumeDetailsService.getDetails();
        const hasData = isResumeDetailsComplete(details);
        setHasDetails(hasData);
        if (!hasData) {
          navigate("/resume", { replace: true });
          toast({
            title: "Resume details required",
            description: "Please update your form first then only you can run analysis.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load resume details",
          variant: "destructive",
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [toast, navigate]);

  const canRunAnalysis =
    !!jobTitle.trim() && !!jobDescription.trim() && jobDescription.trim().length >= 50;

  useEffect(() => {
    if (isAnalyzing) {
      // Reset and start a smooth, bounded progress loop while backend runs
      setAnalysisProgress(5);
      setAnalysisStep(ANALYSIS_STEPS[0]);
      analysisStepIndexRef.current = 0;

      if (analysisIntervalRef.current != null) {
        clearInterval(analysisIntervalRef.current);
      }

      analysisIntervalRef.current = window.setInterval(() => {
        setAnalysisProgress((prev) => {
          // Let the bar creep up but never reach 100% until the API responds
          if (prev >= 90) return prev;
          return prev + 3;
        });

        analysisStepIndexRef.current =
          (analysisStepIndexRef.current + 1) % ANALYSIS_STEPS.length;
        setAnalysisStep(ANALYSIS_STEPS[analysisStepIndexRef.current]);
      }, 800);
    } else {
      if (analysisIntervalRef.current != null) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    }

    return () => {
      if (analysisIntervalRef.current != null) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    };
  }, [isAnalyzing]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!canRunAnalysis || isAnalyzing) return;
    if (!hasDetails) {
      toast({
        title: "Resume details required",
        description: "Please update your form first then only you can run analysis.",
        variant: "destructive",
      });
      navigate("/resume");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setAnalysisProgress(0);
      setAnalysisStep(null);
      setIsAnalyzing(true);
      setAnalysisError(null);
      setResult(null);
      setPdfResult(null);

      const data = await V2AnalysisService.analyze(jobTitle.trim(), jobDescription.trim(), {
        signal: controller.signal,
      });
      setResult(data);
      setAnalysisProgress(100);
      setAnalysisStep("Analysis complete");
      toast({
        title: "Analysis complete",
        description: "Your ATS  analysis is ready.",
      });
      // Update free trial / usage count from server after successful analysis
      refreshUsage().catch(() => {});
    } catch (error: any) {
      const isAborted = error?.name === "AbortError" || error?.code === "ERR_CANCELED";
      if (isAborted) {
        // User cancelled – no usage counted; refresh so badge shows correct remaining
        toast({
          title: "Analysis cancelled",
          description: "The analysis was stopped. No usage was counted.",
        });
        refreshUsage().catch(() => {});
        return;
      }
      const message = error.message || "Failed to run analysis";
      setAnalysisError(message);
      toast({
        title: "Analysis failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelAnalysis = () => {
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancelAnalysis = () => {
    abortControllerRef.current?.abort();
    setShowCancelConfirmModal(false);
  };

  const handleGeneratePdf = async () => {
    if (!result || isGeneratingPdf) return;

    try {
      setIsGeneratingPdf(true);
      const [pdf, details] = await Promise.all([
        V2AnalysisService.generatePdf(result.analysisId),
        ResumeDetailsService.getDetails(),
      ]);
      setPdfResult(pdf);
      const professionalName = details?.professional_name?.trim() || "";

      toast({
        title: "PDF ready",
        description: "Your optimized resume PDF has been generated.",
      });
      navigate("/resume-result", {
        state: { pdfResult: pdf, jobTitle: jobTitle.trim(), professionalName },
      });
    } catch (error: any) {
      const message = error.message || "Failed to generate PDF";
      toast({
        title: "PDF generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <DashboardLayout activeTab="Resume Analysis">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">ATS Builder  Analysis</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Use your saved resume details and a job description to generate an optimized resume.
          </p>
        </div>

        {loadingDetails ? (
          <Card>
            <CardContent className="p-6 flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Checking your resume details...</span>
            </CardContent>
          </Card>
        ) : !hasDetails ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                Resume details are required to run analysis. You will be redirected to the resume form.
              </p>
              <Button onClick={() => navigate("/resume")}>Go to Resume form</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Job Details
                </CardTitle>
                <CardDescription>
                  Paste the job title and full job description for the role you are targeting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="jobTitle">
                    Job Title
                  </label>
                  <Input
                    id="jobTitle"
                    placeholder="Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    disabled={isAnalyzing}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="jobDescription">
                    Job Description
                  </label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isAnalyzing}
                    className="min-h-[160px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    For best results, paste the complete job posting. Minimum 50 characters.
                  </p>
                </div>

                {analysisError && (
                  <p className="text-sm text-destructive">{analysisError}</p>
                )}

                <div className="space-y-3">
                  <div className="flex justify-end gap-2">
                    {isAnalyzing && (
                      <Button type="button" variant="outline" onClick={handleCancelAnalysis}>
                        Cancel analysis
                      </Button>
                    )}
                    <Button onClick={handleAnalyze} disabled={!canRunAnalysis || isAnalyzing}>
                      {isAnalyzing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Run ATS  Analysis
                    </Button>
                  </div>

                  {(isAnalyzing || analysisProgress > 0) && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{analysisStep ?? "Preparing analysis..."}</span>
                        <span>{Math.round(analysisProgress)}%</span>
                      </div>
                      <Progress value={analysisProgress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Review how your profile resume matches the role and the suggested improvements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold">Improved Summary</h3>
                    <p className="text-sm whitespace-pre-line">
                      {stripMarkdownAsterisks(result.improvedSummary)}
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold">Improved Experience</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.improvedExperience.flatMap((line) =>
                        parseExperienceBullets(line).map((bullet) =>
                          collapseNewlines(stripMarkdownAsterisks(bullet))
                        )
                      ).filter(Boolean).map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold">Improved Skills</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {parseSkillsList(stripMarkdownAsterisks(result.improvedSkills)).map((skill, idx) => (
                        <li key={idx}>{collapseNewlines(skill)}</li>
                      ))}
                    </ul>
                  </section>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t mt-2">
                    <div className="text-sm text-muted-foreground">
                      Ready to turn this into an optimized PDF.
                    </div>
                    <Button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
                      {isGeneratingPdf && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Generate PDF
                    </Button>
                  </div>

                  {/* ATS Score hidden for now
                  {pdfResult && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold">ATS Score:</span>
                        <span className="text-2xl font-bold">
                          {pdfResult.atsScore}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">ATS Breakdown</h4>
                        <ul className="space-y-1 text-sm">
                          {(Array.isArray(pdfResult.atsBreakdown) ? pdfResult.atsBreakdown : []).map((item, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{item?.module ?? "—"}</span>: {item?.score ?? "—"}
                              {item?.feedback ? ` — ${item.feedback}` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  */}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <AlertDialog open={showCancelConfirmModal} onOpenChange={setShowCancelConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop analysis?</AlertDialogTitle>
            <AlertDialogDescription>
              The analysis is still running. If you continue, the request will be cancelled immediately. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, continue</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancelAnalysis} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, stop
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

