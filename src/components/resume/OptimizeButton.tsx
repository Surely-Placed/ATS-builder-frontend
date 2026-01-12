import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface OptimizeButtonProps {
  onStartOptimization: () => void;
}

export const OptimizeButton = ({
  onStartOptimization,
}: OptimizeButtonProps) => {
  return (
    <Card className="optimize-action">
      <CardContent className="pt-6">
        <Button
          onClick={onStartOptimization}
          size="lg"
          className="btn-optimize w-full"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Optimize Resume & Generate New Version
        </Button>
        <p className="optimize-note">
          This will generate an optimized resume with improved ATS score and better keyword
          alignment
        </p>
      </CardContent>
    </Card>
  );
};
