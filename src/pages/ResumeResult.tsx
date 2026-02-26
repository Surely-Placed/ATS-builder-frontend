import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft, Loader2 } from "lucide-react";
import type { PdfResult, PdfBreakdownItem } from "@/features/analysis/services/v2Types";
import { DownloadService } from "@/features/analysis/services/downloadService";
import { buildResumePdfFilename } from "@/utils/text";

function normalizeBreakdown(atsBreakdown: unknown): PdfBreakdownItem[] {
  if (Array.isArray(atsBreakdown)) {
    return atsBreakdown.map((item) => ({
      module: item?.module ?? "—",
      score: typeof item?.score === "number" ? item.score : 0,
      feedback: item?.feedback,
    }));
  }
  return [];
}

export default function ResumeResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfResult = state?.pdfResult as PdfResult | undefined;
  const jobTitle = (state as any)?.jobTitle ?? "";
  const professionalName = (state as any)?.professionalName ?? "";

  if (!pdfResult?.url) {
    return (
      <DashboardLayout activeTab="Resume Analysis">
        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl font-semibold">Resume Result</h1>
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-muted-foreground">
                No resume result to show. Generate an optimized resume from Resume Analysis first.
              </p>
              <Button onClick={() => navigate("/resume-analysis")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go to Resume Analysis
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const breakdown = normalizeBreakdown(pdfResult.atsBreakdown);
  const [downloading, setDownloading] = useState(false);

  const pdfFilename = buildResumePdfFilename(professionalName, jobTitle);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await DownloadService.downloadFile(pdfResult.url, pdfFilename);
    } catch {
      // Error already thrown by downloadFile; optional: show toast
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DashboardLayout activeTab="Resume Analysis">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold">Your Resume</h1>
          <Button variant="outline" onClick={() => navigate("/resume-analysis")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Analysis
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resume preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/30 overflow-hidden">
              <iframe
                src={pdfResult.url}
                title="Resume PDF"
                className="w-full aspect-[8.5/11] min-h-[500px] max-h-[70vh]"
              />
            </div>
            <Button onClick={handleDownload} className="w-full sm:w-auto" disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
              Download Resume PDF
            </Button>
          </CardContent>
        </Card>

        {/* ATS Score hidden for now
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ATS Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">Score:</span>
              <span className="text-3xl font-bold">{pdfResult.atsScore}</span>
            </div>
            {breakdown.length > 0 && (
              <ul className="space-y-1.5 text-sm">
                {breakdown.map((item, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{item.module}</span>: {item.score}
                    {item.feedback ? ` — ${item.feedback}` : ""}
                  </li>
                ))}
              </ul>
            )}
            <Button onClick={handleDownload} className="w-full sm:w-auto">
              <FileDown className="h-4 w-4 mr-2" />
              Download Resume PDF
            </Button>
          </CardContent>
        </Card>
        */}
      </div>
    </DashboardLayout>
  );
}
