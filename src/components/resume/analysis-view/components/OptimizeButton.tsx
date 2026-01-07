import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface OptimizeButtonProps {
  isWebSocketConnected: boolean;
  onStartOptimization: () => void;
}

export const OptimizeButton = ({
  isWebSocketConnected,
  onStartOptimization,
}: OptimizeButtonProps) => {
  return (
    <Card className="optimize-action">
      <CardContent className="pt-6">
        <Button
          onClick={onStartOptimization}
          size="lg"
          className="btn-optimize w-full"
          disabled={!isWebSocketConnected}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {!isWebSocketConnected ? "Connecting..." : "Optimize Resume & Generate New Version"}
        </Button>
        {!isWebSocketConnected && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Waiting for server connection...
          </p>
        )}
        <p className="optimize-note">
          This will generate an optimized resume with improved ATS score and better keyword
          alignment
        </p>
      </CardContent>
    </Card>
  );
};
