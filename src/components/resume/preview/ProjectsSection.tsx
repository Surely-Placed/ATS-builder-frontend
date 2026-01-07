import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResumeStructure, ChangeHighlight } from "@/types/resume/preview";
import { SectionWrapper } from "./SectionWrapper";
import { SectionHeader } from "./SectionHeader";
import { getBadgeStyles, highlightText } from "@/utils/resume/preview";

interface ProjectsSectionProps {
  resume: ResumeStructure;
  changes: ChangeHighlight[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ resume, changes }) => {
  return (
    <SectionWrapper sectionKey="projects" changes={changes}>
      <SectionHeader title="Projects" sectionKey="projects" changes={changes} />
      {resume.projects.map((project, projIndex) => {
        const projChanges = changes.filter((c) => c.location?.index === projIndex);
        const descChange = projChanges.find((c) => c.field === `description_${projIndex}`);
        const techChange = projChanges.find((c) => c.field === `technologies_${projIndex}`);

        return (
          <Card key={projIndex} className="mb-4">
            <CardContent className="p-4">
              <h4 className="font-semibold text-foreground mb-2">{project.name}</h4>
              <div
                className={`text-sm text-muted-foreground mb-3 ${descChange ? "p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800" : ""}`}
              >
                {descChange
                  ? highlightText(project.description, projChanges, `description_${projIndex}`)
                  : project.description}
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
    </SectionWrapper>
  );
};
