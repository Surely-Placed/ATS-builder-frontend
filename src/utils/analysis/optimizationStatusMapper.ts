/**
 * Maps optimization status from the backend to standardized status values
 * @param status - The raw status from the backend
 * @returns Standardized optimization status
 */
export const mapOptimizationStatus = (
  status: string
): "optimization_pending" | "optimization_processing" | "optimization_completed" | "optimization_failed" => {
  switch (status) {
    case "starting":
      return "optimization_pending";
    case "running":
      return "optimization_processing";
    case "complete":
      return "optimization_completed";
    case "failed":
      return "optimization_failed";
    default:
      return "optimization_failed"; // Default to failed for unknown statuses
  }
};