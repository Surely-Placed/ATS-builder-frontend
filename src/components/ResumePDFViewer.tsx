import React, { useState } from 'react';
import { getPdfViewerUrl, isLocalStorageUrl } from '../utils/resumeUrlHelper';

interface ResumePDFViewerProps {
  resume: {
    id?: string;
    original_file_url?: string | null;
    optimized_file_url?: string | null;
  };
  useProxy?: boolean; // Use authenticated proxy endpoint
  preferOptimized?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ResumePDFViewer: React.FC<ResumePDFViewerProps> = ({
  resume,
  useProxy = false,
  preferOptimized = true,
  className,
  style
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const pdfUrl = getPdfViewerUrl(resume, { useProxy, preferOptimized });

  return (
    <div className={`resume-pdf-viewer ${className || ''}`} style={style}>
      {error && (
        <div className="error-message">
          <p>Failed to load PDF: {error}</p>
          <button onClick={() => window.open(pdfUrl, '_blank')}>
            Open in new tab
          </button>
        </div>
      )}
      {loading && <div className="loading">Loading PDF...</div>}
      <iframe
        src={pdfUrl}
        title="Resume PDF"
        style={{
          width: '100%',
          height: '600px',
          border: 'none',
          display: error ? 'none' : 'block'
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError('Failed to load PDF viewer');
          setLoading(false);
        }}
      />
    </div>
  );
};

