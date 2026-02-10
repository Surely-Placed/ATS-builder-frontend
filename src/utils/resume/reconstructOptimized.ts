import type { ResumeStructure, ChangeHighlight, ResumeDiffResult } from "@/types/resume/preview";

/**
 * Reconstructs the optimized resume structure by applying changes to the original resume
 * This is a workaround for when the backend doesn't return structured_data for optimized resume
 */
export function reconstructOptimizedResume(
    originalResume: ResumeStructure,
    changes: ResumeDiffResult
): ResumeStructure {
    // Deep clone the original resume to avoid mutations
    const optimized: ResumeStructure = JSON.parse(JSON.stringify(originalResume));

    // Apply changes from the diff result
    changes.sections.forEach((sectionChange) => {
        if (!sectionChange.hasChanges) return;

        sectionChange.changes.forEach((change) => {
            applyChange(optimized, change);
        });
    });

    return optimized;
}

/**
 * Applies a single change to the resume structure
 */
function applyChange(resume: ResumeStructure, change: ChangeHighlight): void {
    const { section, field, optimized: optimizedValue, changeType, location } = change;

  

    switch (section) {
        case "summary":
     
            if (field === "content" && typeof optimizedValue === "string") {
              
                resume.summary = optimizedValue;
            } else {
          
            }
            break;

        case "skills":
            if (field === "skills" && Array.isArray(optimizedValue)) {
                resume.skills = optimizedValue;
            } else if (field === "order" && Array.isArray(optimizedValue)) {
                resume.skills = optimizedValue;
            }
            break;

        case "work_experience":
            if (location?.index !== undefined && resume.work_experience[location.index]) {
                const exp = resume.work_experience[location.index];
                if (field === "responsibilities" && Array.isArray(optimizedValue)) {
                    exp.responsibilities = optimizedValue;
                } else if (field === "title" && typeof optimizedValue === "string") {
                    exp.title = optimizedValue;
                } else if (field === "company" && typeof optimizedValue === "string") {
                    exp.company = optimizedValue;
                } else if (field === "dates" && typeof optimizedValue === "string") {
                    exp.dates = optimizedValue;
                }
            }
            break;

        case "projects":
            if (location?.index !== undefined && resume.projects[location.index]) {
                const project = resume.projects[location.index];
                if (field === "description" && typeof optimizedValue === "string") {
                    project.description = optimizedValue;
                } else if (field === "name" && typeof optimizedValue === "string") {
                    project.name = optimizedValue;
                } else if (field === "technologies" && Array.isArray(optimizedValue)) {
                    project.technologies = optimizedValue;
                }
            }
            break;

        case "education":
            if (location?.index !== undefined && resume.education[location.index]) {
                const edu = resume.education[location.index];
                if (field === "degree" && typeof optimizedValue === "string") {
                    edu.degree = optimizedValue;
                } else if (field === "institution" && typeof optimizedValue === "string") {
                    edu.institution = optimizedValue;
                } else if (field === "dates" && typeof optimizedValue === "string") {
                    edu.dates = optimizedValue;
                } else if (field === "gpa" && typeof optimizedValue === "string") {
                    edu.gpa = optimizedValue;
                }
            }
            break;

        case "certifications":
            if (location?.index !== undefined && resume.certifications[location.index]) {
                const cert = resume.certifications[location.index];
                if (field === "name" && typeof optimizedValue === "string") {
                    cert.name = optimizedValue;
                } else if (field === "issuer" && typeof optimizedValue === "string") {
                    cert.issuer = optimizedValue;
                } else if (field === "date" && typeof optimizedValue === "string") {
                    cert.date = optimizedValue;
                }
            }
            break;
    }
}
