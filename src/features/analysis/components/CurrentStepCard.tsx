import React from "react";
import { Loader2, CheckCircle2, X } from "lucide-react";
import { Step } from "@/constants/analysis/steps";

interface CurrentStepCardProps {
  step: Step;
  isActive: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  progress?: number;
  type?: "analysis" | "optimization";
}

export const CurrentStepCard: React.FC<CurrentStepCardProps> = ({
  step,
  isActive,
  isCompleted,
  isFailed,
  progress = 0,
  type = "analysis",
}) => {
  // Show "Starting optimization..." when progress is very low or step is undefined
  const isStarting = !step || (progress === 0 && isActive);
  
  if (isStarting && type === "optimization" && isActive) {
    return (
      <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div className="flex-1">
            <h3 className="font-semibold">Starting Optimization</h3>
            <p className="text-sm text-muted-foreground">Preparing to optimize your resume...</p>
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!step) return null;

  return (
    <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{step.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold"> {step.title}</h3>

          <p className="text-sm text-muted-foreground">{step.description}</p>
        </div>
        {isActive && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
        {isCompleted && <CheckCircle2 className="w-6 h-6 text-green-500" />}
        {isFailed && <X className="w-6 h-6 text-destructive" />}
      </div>
    </div>
  );
};
