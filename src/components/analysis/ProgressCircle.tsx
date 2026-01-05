import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressCircleProps {
  progress: number;
  isActive: boolean;
  isFailed: boolean;
  isCompleted: boolean;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  isActive,
  isFailed,
  isCompleted,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-32 h-32">
        <Loader2
          className={`w-32 h-32 ${isActive ? 'animate-spin' : ''} ${
            isFailed ? 'text-destructive' : isCompleted ? 'text-green-500' : 'text-primary'
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

