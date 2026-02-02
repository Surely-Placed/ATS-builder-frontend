import DashboardLayout from "@/components/layouts/DashboardLayout";
import ResumeAnalysisFlow from "@/features/analysis/components/ResumeAnalysisFlow";

export default function ResumeAnalysis() {
  const handleAnalysisComplete = () => {
    // Handle completion if needed (e.g., show notification, update dashboard stats, etc.)
  };

  return (
    <DashboardLayout activeTab="Resume Analysis">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">Resume Analysis</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Upload your resume and job posting to get AI-powered ATS analysis
          </p>
        </div>

        {/* Resume Analysis Flow */}
        <ResumeAnalysisFlow onComplete={handleAnalysisComplete} />
      </div>
    </DashboardLayout>
  );
}
