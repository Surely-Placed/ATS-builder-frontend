import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ResumeManager from "@/features/resume/components/ResumeManager";
import { ResumeFilters, FilterType } from "@/features/resume/components/ResumeFilters";
import { useResumeFilters } from "@/features/resume/hooks/useResumeFilters";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const VALID_FILTERS: FilterType[] = ["all", "not_completed", "optimized"];
const parseFilter = (v: string | null): FilterType =>
  v && VALID_FILTERS.includes(v as FilterType) ? (v as FilterType) : "all";

const Documents = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<FilterType>(
    () => parseFilter(searchParams.get("filter"))
  );
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const { counts, resumes, loading, error, refetch, refetchCounts } =
    useResumeFilters(activeFilter);

  const [currentPage, setCurrentPage] = useState(() => {
    const p = searchParams.get("page");
    const n = p ? parseInt(p, 10) : 1;
    return Number.isFinite(n) && n >= 1 ? n : 1;
  });
  const itemsPerPage = 10;

  // Sync filter and page to URL so refresh keeps state
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("filter", activeFilter);
    if (currentPage > 1) next.set("page", String(currentPage));
    else next.delete("page");
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [activeFilter, currentPage, searchParams]);

  // Restore filter/page from URL on back/forward
  useEffect(() => {
    const filter = parseFilter(searchParams.get("filter"));
    const p = searchParams.get("page");
    const pageNum = p && Number.isFinite(parseInt(p, 10)) ? Math.max(1, parseInt(p, 10)) : 1;
    setActiveFilter((prev) => (prev !== filter ? filter : prev));
    setCurrentPage((prev) => (prev !== pageNum ? pageNum : prev));
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("q", value);
    else nextParams.delete("q");
    setSearchParams(nextParams, { replace: true });
  };

  // Filter resumes based on search query
  const filteredResumes = resumes.filter((resume) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const title = resume.latestAnalysis?.jobTitle?.toLowerCase();
    const idSnippet = resume.id.substring(0, 8).toLowerCase();
    const atsScore = resume.latestAnalysis?.atsScoreBefore?.toString();
    
    // Search by job title, ID, or ATS score
    if (title && title.includes(query)) return true;
    if (idSnippet.includes(query)) return true;
    if (atsScore && atsScore.includes(query)) return true;
    
    return false;
  });
  
  // Calculate Pagination based on filtered results
  const totalItems = filteredResumes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedResumes = filteredResumes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refetch counts when filter changes
  useEffect(() => {
    refetchCounts();
  }, [activeFilter, refetchCounts]);

  return (
    <DashboardLayout activeTab="Documents">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold mb-1">My Resumes</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Manage and view all your resume documents
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by job title..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <ResumeFilters
              activeFilter={activeFilter}
              onFilterChange={(filter) => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              counts={counts}
            />
          </div>
        </div>
        <ResumeManager
          counts={counts}
          resumes={paginatedResumes} // Pass filtered and paginated resumes
          loading={loading}
          error={error}
          refetch={refetch}
          refetchCounts={refetchCounts}
          // Pagination Props
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </DashboardLayout>
  );
};

export default Documents;
