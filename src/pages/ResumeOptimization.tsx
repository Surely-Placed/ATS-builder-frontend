import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ResumeAnalysisFlow from "@/features/analysis/components/ResumeAnalysisFlow";
import { useUsage } from '@/context/UsageContext';


export default function ResumeOptimization() {
  const handleAnalysisComplete = () => {
    // Handle completion if needed (e.g., show notification, update dashboard stats, etc.)
  };
  const { state } = useUsage();
  const remainingRaw = state.remaining;
  const remaining = remainingRaw === 'unlimited' ? Infinity : (typeof remainingRaw === 'number' ? remainingRaw : null);
  const trialBlocked = (state.plan === 'free') && remaining !== null && remaining <= 0;
  const [showPricing, setShowPricing] = React.useState(false);

  // Always render the optimization flow and show the pricing dialog if needed
  return (
    <DashboardLayout activeTab="Resume Optimization">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">Resume Optimization</h1>
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
