import React from 'react';
import { getResumeUrl } from '../utils/resumeUrlHelper';

interface ResumeDownloadButtonProps {
  resume: {
    id?: string;
    original_file_url?: string | null;
    optimized_file_url?: string | null;
  };
  useProxy?: boolean;
  preferOptimized?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ResumeDownloadButton: React.FC<ResumeDownloadButtonProps> = ({
  resume,
  useProxy = false,
  preferOptimized = true,
  className,
  children = 'Download PDF'
}) => {
  const handleDownload = () => {
    try {
      const url = getResumeUrl(resume, { useProxy, preferOptimized });
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume-${resume.id || 'download'}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      alert('Failed to download resume. Please try again.');
    }
  };

  return (
    <button onClick={handleDownload} className={className}>
      {children}
    </button>
  );
};

