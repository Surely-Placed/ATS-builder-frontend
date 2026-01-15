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
    id: "retrieve-resume",
    title: "Retrieving Resume",
    description: "Loading resume from database",
    icon: "📄",
    estimatedTime: 500,
  },
  {
    id: "parse-resume",
    title: "Parsing Resume",
    description: "Extracting content and structure",
    icon: "📝",
    estimatedTime: 2000,
  },
  {
    id: "extract-job",
    title: "Analyzing Job Description",
    description: "Extracting requirements and skills",
    icon: "🔍",
    estimatedTime: 3000,
  },
  {
    id: "save-job",
    title: "Saving Job Details",
    description: "Storing job information",
    icon: "💾",
    estimatedTime: 800,
  },
  {
    id: "calculate-score",
    title: "Calculating ATS Score",
    description: "Computing compatibility score",
    icon: "📊",
    estimatedTime: 1500,
  },
  {
    id: "ai-analysis",
    title: "AI Analysis",
    description: "Analyzing with AI recommendations",
    icon: "🤖",
    estimatedTime: 4000,
  },
  {
    id: "save-analysis",
    title: "Finalizing Results",
    description: "Saving analysis to database",
    icon: "✨",
    estimatedTime: 700,
  },
];

// Optimization Steps (async - progress updates via polling)
export const OPTIMIZATION_STEPS: Step[] = [
  {
    id: "starting",
    title: "Starting Optimization",
    description: "Initializing optimization process",
    icon: "🚀",
    estimatedTime: 1000,
  },
  {
    id: "loading-analysis",
    title: "Loading Analysis Data",
    description: "Retrieving your analysis results",
    icon: "📊",
    estimatedTime: 2000,
  },
  {
    id: "generating-resume",
    title: "Generating Optimized Resume",
    description: "AI-powered optimization in progress",
    icon: "✨",
    estimatedTime: 4000,
  },
  {
    id: "building-structure",
    title: "Building Resume Structure",
    description: "Creating ATS-friendly format",
    icon: "📝",
    estimatedTime: 3000,
  },
  {
    id: "finalizing",
    title: "Finalizing",
    description: "Completing optimization",
    icon: "💾",
    estimatedTime: 1500,
  },
  {
    id: "complete",
    title: "Optimization Complete",
    description: "Your optimized resume is ready",
    icon: "🎉",
    estimatedTime: 500,
  },
];
