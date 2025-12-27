import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

// Types
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

interface WorkExperience {
  company: string;
  title: string;
  dates: string;
  responsibilities: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
}

interface Education {
  degree: string;
  institution: string;
  dates: string;
  gpa?: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

interface ResumeStructure {
  personal_info: PersonalInfo;
  summary: string | null;
  skills: string[];
  work_experience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}

interface ChangeHighlight {
  section: string;
  field: string;
  original: string | string[] | null;
  optimized: string | string[] | null;
  changeType: 'added' | 'removed' | 'modified' | 'reordered';
  location?: { index?: number; line?: number };
}

interface SectionChanges {
  section: string;
  hasChanges: boolean;
  changes: ChangeHighlight[];
}

interface ResumeDiffResult {
  hasChanges: boolean;
  totalChanges: number;
  sections: SectionChanges[];
  summary: {
    sectionsModified: number;
    sectionsUnchanged: number;
  };
}

interface Props {
  originalResume: ResumeStructure;
  optimizedResume: ResumeStructure;
  changes: ResumeDiffResult;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isGenerating?: boolean;
}

const ResumePreviewWithChanges: React.FC<Props> = ({
  originalResume,
  optimizedResume,
  changes,
  onConfirm,
  onCancel,
  isGenerating = false,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'optimized'>('split');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const getSectionChanges = (section: string): ChangeHighlight[] => {
    return changes.sections.find((s) => s.section === section)?.changes || [];
  };

  const highlightText = (text: string, sectionChanges: ChangeHighlight[], field: string): React.ReactNode => {
    const relevantChanges = sectionChanges.filter((c) => c.field === field || c.field.startsWith(field));
    if (relevantChanges.length === 0) return <span>{text}</span>;
    
    const change = relevantChanges[0];
    const highlightClass = 
      change.changeType === 'modified' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700' :
      change.changeType === 'added' ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700' :
      'bg-gray-100 dark:bg-gray-800';
    
    return (
      <span className={`px-1 py-0.5 rounded border ${highlightClass} transition-colors`}>
        {text}
      </span>
    );
  };

  const renderPersonalInfo = (resume: ResumeStructure) => (
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <h3 className="text-xl font-bold text-foreground mb-2">{resume.personal_info.name}</h3>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>📧 {resume.personal_info.email}</span>
        <span>📱 {resume.personal_info.phone}</span>
        {resume.personal_info.location && <span>📍 {resume.personal_info.location}</span>}
        {resume.personal_info.linkedin && <span>🔗 LinkedIn</span>}
      </div>
    </div>
  );

  const renderSummary = (resume: ResumeStructure, isOriginal: boolean) => {
    const sectionChanges = getSectionChanges('summary');
    const hasChanges = sectionChanges.length > 0;
    const isExpanded = expandedSections.has('summary') || viewMode !== 'split';

    return (
      <div className={`mb-6 ${hasChanges ? 'border-l-4 border-yellow-500 dark:border-yellow-400 pl-4 bg-yellow-50/30 dark:bg-yellow-900/10 rounded-r' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-foreground">Summary</h3>
          {hasChanges && (
            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700">
              {sectionChanges.length} change{sectionChanges.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {resume.summary && (
          <div className={`text-muted-foreground leading-relaxed ${isExpanded ? 'block' : viewMode === 'split' ? 'line-clamp-3' : 'block'}`}>
            {highlightText(resume.summary, sectionChanges, 'content')}
          </div>
        )}
        {viewMode === 'split' && resume.summary && resume.summary.length > 150 && (
          <button
            onClick={() => toggleSection('summary')}
            className="text-primary text-sm mt-1 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  const renderSkills = (resume: ResumeStructure) => {
    const sectionChanges = getSectionChanges('skills');
    const hasChanges = sectionChanges.length > 0;
    const isExpanded = expandedSections.has('skills') || viewMode !== 'split';

    return (
      <div className={`mb-6 ${hasChanges ? 'border-l-4 border-blue-500 dark:border-blue-400 pl-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-r' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Skills</h3>
          {hasChanges && (
            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-700">
              {sectionChanges.some(c => c.changeType === 'reordered') ? 'Reordered' : 'Modified'}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => {
              const skillChange = sectionChanges.find((c) => c.field === `skill_${index}` || c.field === 'order');
              const isReordered = sectionChanges.some((c) => c.changeType === 'reordered');
              const isModified = skillChange?.changeType === 'modified';
              
              return (
                <span
                  key={index}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isModified
                      ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 border-2 border-yellow-400 dark:border-yellow-600 shadow-sm'
                      : isReordered && index < 8
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 border-2 border-blue-400 dark:border-blue-600 shadow-sm'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            {resume.skills.slice(0, 8).join(', ')}
            {resume.skills.length > 8 && ` +${resume.skills.length - 8} more`}
          </div>
        )}
      </div>
    );
  };

  const renderWorkExperience = (resume: ResumeStructure) => {
    const sectionChanges = getSectionChanges('work_experience');
    const hasChanges = sectionChanges.length > 0;

    return (
      <div className={`mb-6 ${hasChanges ? 'border-l-4 border-purple-500 dark:border-purple-400 pl-4 bg-purple-50/30 dark:bg-purple-900/10 rounded-r' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Work Experience</h3>
          {hasChanges && (
            <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100 border-purple-300 dark:border-purple-700">
              {sectionChanges.length} update{sectionChanges.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        {resume.work_experience.map((exp, expIndex) => {
          const expChanges = sectionChanges.filter((c) => c.location?.index === expIndex);
          const isExpanded = expandedSections.has(`work_${expIndex}`) || viewMode !== 'split';

          return (
            <Card key={expIndex} className="mb-4">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{exp.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exp.dates}</p>
                  </div>
                  {expChanges.length > 0 && (
                    <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100 border-purple-300 dark:border-purple-700">
                      {expChanges.length} change{expChanges.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                {isExpanded ? (
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mt-3">
                    {exp.responsibilities.map((bullet, bulletIndex) => {
                      const bulletChange = expChanges.find((c) => c.field === `responsibility_${expIndex}_${bulletIndex}`);
                      const isModified = bulletChange?.changeType === 'modified';
                      const isAdded = bulletChange?.changeType === 'added';
                      
                      return (
                        <li
                          key={bulletIndex}
                          className={`px-3 py-2 rounded transition-all ${
                            isModified
                              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-l-4 border-yellow-400 dark:border-yellow-600'
                              : isAdded
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-l-4 border-green-400 dark:border-green-600'
                              : 'bg-background'
                          }`}
                        >
                          {bulletChange ? highlightText(bullet, expChanges, `responsibility_${expIndex}_${bulletIndex}`) : bullet}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                    {exp.responsibilities.slice(0, 2).map((bullet, idx) => (
                      <li key={idx} className="line-clamp-1">{bullet}</li>
                    ))}
                    {exp.responsibilities.length > 2 && (
                      <li className="text-muted-foreground text-xs">+{exp.responsibilities.length - 2} more</li>
                    )}
                  </ul>
                )}
                {viewMode === 'split' && expChanges.length > 0 && (
                  <button
                    onClick={() => toggleSection(`work_${expIndex}`)}
                    className="text-primary text-xs mt-2 hover:underline font-medium"
                  >
                    {isExpanded ? '▼ Show less' : '▶ Show more'}
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderProjects = (resume: ResumeStructure) => {
    const sectionChanges = getSectionChanges('projects');
    const hasChanges = sectionChanges.length > 0;

    return (
      <div className={`mb-6 ${hasChanges ? 'border-l-4 border-green-500 dark:border-green-400 pl-4 bg-green-50/30 dark:bg-green-900/10 rounded-r' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Projects</h3>
          {hasChanges && (
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700">
              Enhanced
            </Badge>
          )}
        </div>
        {resume.projects.map((project, projIndex) => {
          const projChanges = sectionChanges.filter((c) => c.location?.index === projIndex);
          const descChange = projChanges.find((c) => c.field === `description_${projIndex}`);
          const techChange = projChanges.find((c) => c.field === `technologies_${projIndex}`);
          
          return (
            <Card key={projIndex} className="mb-4">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-2">{project.name}</h4>
                <div className={`text-sm text-muted-foreground mb-3 ${descChange ? 'p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800' : ''}`}>
                  {descChange ? highlightText(project.description, projChanges, `description_${projIndex}`) : project.description}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className={techChange ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 border-green-400 dark:border-green-600' : ''}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderEducation = (resume: ResumeStructure) => {
    const sectionChanges = getSectionChanges('education');
    const hasChanges = sectionChanges.length > 0;

    return (
      <div className={`mb-6 ${hasChanges ? 'border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-r' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Education</h3>
          {hasChanges && (
            <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-100 border-indigo-300 dark:border-indigo-700">
              Modified
            </Badge>
          )}
        </div>
        {resume.education.map((edu, eduIndex) => (
          <Card key={eduIndex} className="mb-3">
            <CardContent className="p-3">
              <h4 className="font-semibold text-foreground">{edu.degree}</h4>
              <p className="text-sm text-muted-foreground">{edu.institution}</p>
              <p className="text-xs text-muted-foreground mt-1">{edu.dates}</p>
              {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderCertifications = (resume: ResumeStructure) => {
    const sectionChanges = getSectionChanges('certifications');
    const hasChanges = sectionChanges.length > 0;

    if (resume.certifications.length === 0) return null;

    return (
      <div className={`mb-6 ${hasChanges ? 'border-l-4 border-teal-500 dark:border-teal-400 pl-4 bg-teal-50/30 dark:bg-teal-900/10 rounded-r' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">Certifications</h3>
          {hasChanges && (
            <Badge variant="outline" className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-100 border-teal-300 dark:border-teal-700">
              Enhanced
            </Badge>
          )}
        </div>
        {resume.certifications.map((cert, certIndex) => (
          <Card key={certIndex} className="mb-2">
            <CardContent className="p-3">
              <p className="text-sm font-medium text-foreground">{cert.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{cert.issuer} • {cert.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderResumeContent = (resume: ResumeStructure, isOriginal: boolean) => (
    <div className="space-y-6">
      {renderPersonalInfo(resume)}
      {renderSummary(resume, isOriginal)}
      {renderSkills(resume)}
      {renderWorkExperience(resume)}
      {renderProjects(resume)}
      {renderEducation(resume)}
      {renderCertifications(resume)}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
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
            
            {/* View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-semibold text-foreground">View Mode:</span>
              {(['split', 'original', 'optimized'] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  variant={viewMode === mode ? 'default' : 'outline'}
                  size="sm"
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} View
                </Button>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    📊 {changes.totalChanges} total change{changes.totalChanges !== 1 ? 's' : ''} across{' '}
                    {changes.summary.sectionsModified} section{changes.summary.sectionsModified !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {changes.summary.sectionsUnchanged} section{changes.summary.sectionsUnchanged !== 1 ? 's' : ''} unchanged
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={onCancel}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
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
                      <>
                        ✅ Confirm & Generate PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Resume Content */}
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original */}
            <Card>
              <CardHeader className="sticky top-6 bg-background z-10">
                <div className="flex items-center justify-between pb-3 border-b-2 border-border">
                  <CardTitle className="text-xl font-bold">📄 Original Resume</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {renderResumeContent(originalResume, true)}
              </CardContent>
            </Card>

            {/* Optimized */}
            <Card>
              <CardHeader className="sticky top-6 bg-background z-10">
                <div className="flex items-center justify-between pb-3 border-b-2 border-green-500 dark:border-green-400">
                  <CardTitle className="text-xl font-bold">✨ Optimized Resume</CardTitle>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700">
                    {changes.totalChanges} changes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderResumeContent(optimizedResume, false)}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-6 pb-3 border-b-2">
                {viewMode === 'original' ? '📄 Original Resume' : '✨ Optimized Resume'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderResumeContent(viewMode === 'original' ? originalResume : optimizedResume, viewMode === 'original')}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumePreviewWithChanges;

