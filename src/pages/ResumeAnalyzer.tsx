import DashboardLayout from "@/components/layouts/DashboardLayout";
import ResumeAnalysisFlow from "@/components/ResumeAnalysisFlow";

export default function ResumeAnalyzer() {
  const handleAnalysisComplete = () => {
    // Handle completion if needed (e.g., show notification, update dashboard stats, etc.)
  };

  return (
    <DashboardLayout activeTab="Resume Optimization">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">
            Resume Optimization
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Upload your resume and job posting to get AI-powered optimization
          </p>
        </div>

        {/* Resume Analysis Flow */}
        <ResumeAnalysisFlow onComplete={handleAnalysisComplete} />
      </div>
    </DashboardLayout>
  );
}
