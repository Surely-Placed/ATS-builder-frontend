import { AnalysisService } from "./analysisService";
import { OptimizationService } from "./optimizationService";

export type JobStatus = {
  status: "optimization_pending" | "optimization_processing" | "optimization_completed" | "optimization_failed";
  progress: number;
  result?: any;
  error?: string;
};

/**
 * Two-step analysis and optimization function
 * First analyzes the resume, then starts optimization
 * Note: This will be triggered automatically by the UI, no manual button click needed
 */
export async function analyzeAndOptimize(
  resumeId: string,
  jobTitle: string,
  jobDescription: string
): Promise<{ analysisId: string; jobId: string; qualityScore: number | null; result: any }> {
  // 1) First, analyze the resume
  const analyzed = await AnalysisService.analyzeResume({
    resume_id: resumeId,
    job_title: jobTitle,
    job_description: jobDescription,
  });

  const analysisId = analyzed?.analysis?.id;
  if (!analysisId) throw new Error("Analyze succeeded but no analysisId was returned");

  const qualityScore: number | null = (analyzed as any)?.analysis?.quality_score ?? null;

  // 2) Then, start optimization (async)
  const opt = await OptimizationService.startOptimization(analysisId);
  const jobId = opt?.jobId;
  if (!jobId) throw new Error("Optimization start succeeded but no jobId was returned");

  // 3) Poll job status until done (simple 2s polling)
  while (true) {
    const job = await OptimizationService.getJobStatus(jobId);

    const s: JobStatus = {
      status: job.status,
      progress: job.progress,
      result: job.result ?? undefined,
      error: job.error ?? undefined,
    };

    if (s.status === "optimization_completed") {
      return { analysisId, jobId, qualityScore, result: s.result };
    }
    if (s.status === "optimization_failed") {
      throw new Error(s.error || "Optimization failed");
    }

    await new Promise((r) => setTimeout(r, 2000));
  }
}


