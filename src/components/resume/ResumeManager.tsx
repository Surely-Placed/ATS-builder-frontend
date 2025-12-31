import React from 'react';
import { ResumeList } from './ResumeList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

type FilterType = 'all' | 'drafts' | 'published';

interface ResumeManagerProps {
  activeFilter: FilterType;
  counts: { all: number; drafts: number; published: number };
  resumes: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  refetchCounts: () => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({
  resumes,
  loading,
  error,
  refetch,
  refetchCounts,
}) => {

  return (
    <div className="w-full">
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
                  <Button onClick={() => { refetch(); refetchCounts(); }} variant="outline">
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <ResumeList resumes={resumes || []} loading={loading} />
      </div>
    </div>
  );
};

export default ResumeManager;

