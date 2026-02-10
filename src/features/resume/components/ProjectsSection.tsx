import React from "react";
import type { ResumeStructure, ChangeHighlight, ViewMode } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBadgeStyles } from "@/utils/resume/preview";

interface ProjectsSectionProps {
  resume: ResumeStructure;
  originalResume?: ResumeStructure;
  changes: ChangeHighlight[];
  isExpanded: boolean;
  viewMode: ViewMode;
  onToggle: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  resume,
  originalResume,
  changes,
  isExpanded,
  viewMode,
  onToggle,
}) => {
  const projects = resume.projects || [];
  const projectsToShow = isExpanded ? projects : projects.slice(0, 2);
  const hasMoreProjects = projects.length > 2;
  const hasChanges = changes.length > 0;

  return (
    <SectionWrapper sectionKey="projects" changes={changes}>
      <SectionHeader title="Projects" sectionKey="projects" changes={changes} />
      {projectsToShow.map((project, projIndex) => {
        const projChanges = changes.filter((c) => c.location?.index === projIndex);
        const descChange = projChanges.find((c) => c.field === "description");
        const techChange = projChanges.find((c) => c.field === "technologies");
        const hasAnyChange = projChanges.length > 0;

        return (
          <Card key={projIndex} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">{project.name}</h4>
                {projChanges.length > 0 && (
                  <Badge variant="outline" className={getBadgeStyles("purple")}>
                    {projChanges.length} change{projChanges.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                {descChange ? (
                  <span className="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700">
                    {project.description}
                  </span>
                ) : (
                  project.description
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    variant="outline"
                    className={techChange ? getBadgeStyles("green") : ""}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
      {viewMode === "split" && (hasMoreProjects || hasChanges) && (
        <button
          onClick={onToggle}
          className="text-primary text-xs mt-2 hover:underline font-medium"
        >
          {isExpanded ? "▼ Show less" : `▶ Show more (${projects.length - 2} more)`}
        </button>
      )}
    </SectionWrapper>
  );
};
