export interface Step {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedTime: number; // in milliseconds
}

// Analysis Steps (synchronous - simulated progress)
export const ANALYSIS_STEPS: Step[] = [
  {
    id: 'retrieve-resume',
    title: 'Retrieving Resume',
    description: 'Loading resume from database',
    icon: '📄',
    estimatedTime: 500,
  },
  {
    id: 'parse-resume',
    title: 'Parsing Resume',
    description: 'Extracting content and structure',
    icon: '📝',
    estimatedTime: 2000,
  },
  {
    id: 'extract-job',
    title: 'Analyzing Job Description',
    description: 'Extracting requirements and skills',
    icon: '🔍',
    estimatedTime: 3000,
  },
  {
    id: 'save-job',
    title: 'Saving Job Details',
    description: 'Storing job information',
    icon: '💾',
    estimatedTime: 800,
  },
  {
    id: 'calculate-score',
    title: 'Calculating ATS Score',
    description: 'Computing compatibility score',
    icon: '📊',
    estimatedTime: 1500,
  },
  {
    id: 'ai-analysis',
    title: 'AI Analysis',
    description: 'Analyzing with AI recommendations',
    icon: '🤖',
    estimatedTime: 4000,
  },
  {
    id: 'save-analysis',
    title: 'Finalizing Results',
    description: 'Saving analysis to database',
    icon: '✨',
    estimatedTime: 700,
  },
];

// Optimization Steps (async - real-time via WebSocket)
export const OPTIMIZATION_STEPS: Step[] = [
  {
    id: 'starting',
    title: 'Starting Optimization',
    description: 'Initializing optimization process',
    icon: '🚀',
    estimatedTime: 1000,
  },
  {
    id: 'parse-resume',
    title: 'Parsing Resume',
    description: 'Extracting resume structure',
    icon: '📝',
    estimatedTime: 2000,
  },
  {
    id: 'extract-job',
    title: 'Extracting Job Info',
    description: 'Analyzing job requirements',
    icon: '🔍',
    estimatedTime: 2000,
  },
  {
    id: 'calculate-baseline',
    title: 'Calculating Baseline Score',
    description: 'Computing initial ATS score',
    icon: '📊',
    estimatedTime: 1500,
  },
  {
    id: 'ai-ats-analysis',
    title: 'AI ATS Analysis',
    description: 'Deep analysis with AI',
    icon: '🤖',
    estimatedTime: 3000,
  },
  {
    id: 'optimize-resume',
    title: 'Optimizing Resume',
    description: 'AI-powered optimization',
    icon: '✨',
    estimatedTime: 5000,
  },
  {
    id: 'verify-audit',
    title: 'Verifying & Auditing',
    description: 'Keyword alignment and quality check',
    icon: '🔍',
    estimatedTime: 4000,
  },
  {
    id: 'generate-pdf',
    title: 'Generating PDF',
    description: 'Creating ATS-friendly PDF',
    icon: '📄',
    estimatedTime: 3000,
  },
  {
    id: 'upload-file',
    title: 'Uploading File',
    description: 'Saving optimized resume',
    icon: '☁️',
    estimatedTime: 2000,
  },
  {
    id: 'finalizing',
    title: 'Finalizing',
    description: 'Updating records',
    icon: '💾',
    estimatedTime: 1500,
  },
];

