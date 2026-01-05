import React from 'react';
import { Step } from '@/constants/analysis/steps';
import { StepCard } from './StepCard';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  isActive: boolean;
}

export const StepsList: React.FC<StepsListProps> = ({ steps, currentStep, isActive }) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <StepCard
          key={step.id}
          step={step}
          index={index}
          currentStep={currentStep}
          isActive={isActive}
        />
      ))}
    </div>
  );
};

