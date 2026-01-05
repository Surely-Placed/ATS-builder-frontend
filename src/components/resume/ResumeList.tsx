import React from 'react';
import { ResumeWithStatus } from '@/hooks/useResumeFilters';
import { getResumeUrl } from '@/utils/resumeUrlHelper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Download, TrendingUp } from 'lucide-react';

interface ResumeListProps {
  resumes: ResumeWithStatus[];
  loading: boolean;
}

export const ResumeList: React.FC<ResumeListProps> = ({ resumes, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No resumes found in this category.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <Card key={resume.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">
                Resume #{resume.id.substring(0, 8)}
              </CardTitle>
              <Badge 
                variant={resume.status === 'published' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {resume.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume.latestAnalysis && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="font-semibold">{resume.latestAnalysis.jobTitle}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Score: {resume.latestAnalysis.atsScoreBefore}
                  </span>
                  {resume.latestAnalysis.atsScoreAfter !== null && (
                    <>
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {resume.latestAnalysis.atsScoreAfter}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {(() => {
                const originalUrl = getResumeUrl({ 
                  id: resume.id,
                  original_file_url: resume.original_file_url 
                }, { useProxy: true });
                
                return originalUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Original
                    </a>
                  </Button>
                ) : null;
              })()}
              {(() => {
                const optimizedUrl = resume.optimized_file_url 
                  ? getResumeUrl({ 
                      id: resume.id,
                      optimized_file_url: resume.optimized_file_url 
                    }, { useProxy: true })
                  : null;
                
                return optimizedUrl ? (
                  <Button
                    size="sm"
                    asChild
                  >
                    <a
                      href={optimizedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Optimized
                    </a>
                  </Button>
                ) : null;
              })()}
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Created: {new Date(resume.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

