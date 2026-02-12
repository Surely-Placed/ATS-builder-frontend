import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ResumeAnalysisFlow from "@/features/analysis/components/ResumeAnalysisFlow";

export default function ResumeAnalysis() {
  const [searchParams] = useSearchParams();
  const isResumingOptimization = !!searchParams.get("analysisId");

  const handleAnalysisComplete = () => {
    // Handle completion if needed (e.g., show notification, update dashboard stats, etc.)
  };

  return (
    <DashboardLayout activeTab="Resume Analysis">
      <div className="space-y-4 sm:space-y-6">
        {/* Header: show optimization title when resuming via analysisId so page doesn’t load from “upload” */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">
            {isResumingOptimization ? "Resume Optimization" : "Resume Analysis"}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {isResumingOptimization
              ? "Optimizing your resume for better ATS match"
              : "Upload your resume and job posting to get AI-powered ATS analysis"}
          </p>
        </div>

        <ResumeAnalysisFlow onComplete={handleAnalysisComplete} />
      </div>
    </DashboardLayout>
  );
}
