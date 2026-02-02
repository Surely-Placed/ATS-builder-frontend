import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { ResumePreviewProps, ViewMode, ResumeStructure } from "@/types/resume/preview";
import { getSectionChanges, getBadgeStyles } from "@/utils/resume/preview";
import { PersonalInfo } from "./PersonalInfo";
import { SummarySection } from "./SummarySection";
import { SkillsSection } from "./SkillsSection";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { ProjectsSection } from "./ProjectsSection";
import { EducationSection } from "./EducationSection";
import { CertificationsSection } from "./CertificationsSection";

const ResumePreviewWithChanges: React.FC<ResumePreviewProps> = ({
  originalResume,
  optimizedResume,
  changes,
  onConfirm,
  onCancel,
  isGenerating = false,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const renderResumeContent = (resume: ResumeStructure, isOptimized: boolean = true) => {
    // Only show changes on optimized resume, not original
    const summaryChanges = isOptimized ? getSectionChanges("summary", changes) : [];
    const skillsChanges = isOptimized ? getSectionChanges("skills", changes) : [];
    const workChanges = isOptimized ? getSectionChanges("work_experience", changes) : [];
    const projectsChanges = isOptimized ? getSectionChanges("projects", changes) : [];
    const educationChanges = isOptimized ? getSectionChanges("education", changes) : [];
    const certificationsChanges = isOptimized ? getSectionChanges("certifications", changes) : [];

    const isSummaryExpanded = expandedSections.has("summary") || viewMode !== "split";
    const isSkillsExpanded = expandedSections.has("skills") || viewMode !== "split";
    const isProjectsExpanded = expandedSections.has("projects") || viewMode !== "split";
    const isEducationExpanded = expandedSections.has("education") || viewMode !== "split";
    const isCertificationsExpanded = expandedSections.has("certifications") || viewMode !== "split";

    return (
      <div className="space-y-6">
        <PersonalInfo resume={resume} />
        <SummarySection
          resume={resume}
          changes={summaryChanges}
          isExpanded={isSummaryExpanded}
          viewMode={viewMode}
          onToggle={() => toggleSection("summary")}
        />
        <SkillsSection
          resume={resume}
          changes={skillsChanges}
          isExpanded={isSkillsExpanded}
          viewMode={viewMode}
          onToggle={() => toggleSection("skills")}
        />
        <WorkExperienceSection
          resume={resume}
          changes={workChanges}
          expandedSections={expandedSections}
          viewMode={viewMode}
          onToggle={toggleSection}
        />
        <ProjectsSection
          resume={resume}
          changes={projectsChanges}
          isExpanded={isProjectsExpanded}
          viewMode={viewMode}
          onToggle={() => toggleSection("projects")}
        />
        <EducationSection
          resume={resume}
          changes={educationChanges}
          isExpanded={isEducationExpanded}
          viewMode={viewMode}
          onToggle={() => toggleSection("education")}
        />
        <CertificationsSection
          resume={resume}
          changes={certificationsChanges}
          isExpanded={isCertificationsExpanded}
          viewMode={viewMode}
          onToggle={() => toggleSection("certifications")}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2">Resume Optimization Preview</CardTitle>
            <p className="text-muted-foreground mb-6">
              Review highlighted changes below. Colors indicate modifications:
              <span className="ml-2 inline-flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-200 dark:bg-yellow-800 border border-yellow-400 dark:border-yellow-600 rounded"></span>
                Modified
                <span className="ml-2 w-3 h-3 bg-green-200 dark:bg-green-800 border border-green-400 dark:border-green-600 rounded"></span>
                Added
                <span className="ml-2 w-3 h-3 bg-blue-200 dark:bg-blue-800 border border-blue-400 dark:border-blue-600 rounded"></span>
                Reordered
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-foreground">View Mode:</span>
              {(["split", "original", "optimized"] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  variant={viewMode === mode ? "default" : "outline"}
                  size="sm"
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} View
                </Button>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    📊 {changes.totalChanges} total change{changes.totalChanges !== 1 ? "s" : ""}{" "}
                    across {changes.summary.sectionsModified} section
                    {changes.summary.sectionsModified !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {changes.summary.sectionsUnchanged} section
                    {changes.summary.sectionsUnchanged !== 1 ? "s" : ""} unchanged
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={onConfirm}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating & Downloading PDF...
                      </>
                    ) : (
                      <>Confirm & Generate PDF</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {viewMode === "split" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="sticky top-6 bg-background z-10">
                <div className="flex items-center justify-between pb-3 border-b-2 border-border">
                  <CardTitle className="text-xl font-bold">📄 Original Resume</CardTitle>
                </div>
              </CardHeader>
              <CardContent>{renderResumeContent(originalResume, false)}</CardContent>
            </Card>

            <Card>
              <CardHeader className="sticky top-6 bg-background z-10">
                <div className="flex items-center justify-between pb-3 border-b-2 border-green-500 dark:border-green-400">
                  <CardTitle className="text-xl font-bold">✨ Optimized Resume</CardTitle>
                  <Badge variant="outline" className={getBadgeStyles("green")}>
                    {changes.totalChanges} changes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>{renderResumeContent(optimizedResume, true)}</CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-6 pb-3 border-b-2">
                {viewMode === "original" ? "📄 Original Resume" : "✨ Optimized Resume"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderResumeContent(
                viewMode === "original" ? originalResume : optimizedResume,
                viewMode === "optimized"
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumePreviewWithChanges;
