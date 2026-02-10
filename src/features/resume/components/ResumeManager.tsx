import React from "react";
import { ResumeList } from "./ResumeList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ResumeManagerProps {
  counts: { all: number; drafts: number; published: number };
  resumes: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  refetchCounts: () => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({
  resumes,
  loading,
  error,
  refetch,
  refetchCounts,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Main Content - Resume List */}
      <div className="min-h-[400px]">
        {error && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Error loading resumes</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button
                    onClick={() => {
                      refetch();
                      refetchCounts();
                    }}
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <ResumeList resumes={resumes || []} loading={loading} />
      </div>

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                Previous
            </Button>
            <div className="text-sm font-medium mx-2">
                Page {currentPage} of {totalPages}
            </div>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </Button>
          </div>
      )}
    </div>
  );
};

export default ResumeManager;
