import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ResumeManager from "@/features/resume/components/ResumeManager";
import { ResumeFilters } from "@/features/resume/components/ResumeFilters";
import { useResumeFilters } from "@/features/resume/hooks/useResumeFilters";

type FilterType = "all" | "drafts" | "published";

const Documents = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { counts, resumes, loading, error, refetch, refetchCounts } =
    useResumeFilters(activeFilter);

  // Refetch counts when filter changes
  useEffect(() => {
    refetchCounts();
  }, [activeFilter, refetchCounts]);

  return (
    <DashboardLayout activeTab="Documents">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold mb-1">My Resumes</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Manage and view all your resume documents
            </p>
          </div>
          <ResumeFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />
        </div>
        <ResumeManager
          counts={counts}
          resumes={resumes}
          loading={loading}
          error={error}
          refetch={refetch}
          refetchCounts={refetchCounts}
        />
      </div>
    </DashboardLayout>
  );
};

export default Documents;
