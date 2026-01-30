import React from "react";

interface StatusMessageProps {
  type: "analysis" | "optimization";
  isFailed: boolean;
  isCompleted: boolean;
  error?: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  isFailed,
  isCompleted,
  error,
}) => {
  if (isFailed && error) {
    return (
      <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-destructive font-medium">Error: {error}</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
        <p className="text-green-600 font-medium">
          {type === "analysis"
            ? "Analysis completed successfully!"
            : "Optimization completed successfully!"}
        </p>
      </div>
    );
  }


  return null;
};
