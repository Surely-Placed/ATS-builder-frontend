import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Step } from '@/constants/analysis/steps';

interface StepCardProps {
  step: Step;
  index: number;
  currentStep: number;
  isActive: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index, currentStep, isActive }) => {
  const isPast = index < currentStep;
  const isCurrent = index === currentStep;
  const isFuture = index > currentStep;

  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
        isCurrent
          ? 'bg-primary/10 border-2 border-primary shadow-md'
          : isPast
          ? 'bg-green-500/10 border border-green-500/20'
          : 'bg-muted/50 border border-border opacity-60'
      }`}
    >
      <div className="flex-shrink-0">
        {isPast ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : isCurrent ? (
          <span className="text-2xl">{step.icon}</span>
        ) : (
          <span className="text-muted-foreground text-xl">{step.icon}</span>
        )}
      </div>
      <div className="flex-1">
        <h4
          className={`font-medium ${
            isCurrent ? 'text-primary' : isPast ? 'text-green-600' : 'text-muted-foreground'
          }`}
        >
          {step.title}
        </h4>
        <p
          className={`text-sm ${
            isCurrent ? 'text-primary/80' : isPast ? 'text-green-600/80' : 'text-muted-foreground'
          }`}
        >
          {step.description}
        </p>
      </div>
      {isCurrent && isActive && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
    </div>
  );
};

