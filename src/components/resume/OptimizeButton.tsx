import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from 'react';
import { useUsage } from '@/context/UsageContext';
import PricingDialog from '@/components/shared/PricingDialog';

interface OptimizeButtonProps {
  onStartOptimization: () => void;
}

export const OptimizeButton = ({
  onStartOptimization,
}: OptimizeButtonProps) => {
  const { state } = useUsage();
  const remainingRaw = state.remaining;
  const remaining = remainingRaw === 'unlimited' ? Infinity : (typeof remainingRaw === 'number' ? remainingRaw : null);
  const trialBlocked = remaining !== null && remaining <= 0;
  const [showPricing, setShowPricing] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (showPricing) {
      setTimeout(() => setClicked(false), 600);
    }
  }, [showPricing]);

  const handleClick = () => {
    if (trialBlocked) {
      setClicked(true);
      setShowPricing(true);
      setTimeout(() => setClicked(false), 600);
      return;
    }
    setClicked(true);
    onStartOptimization();
    setTimeout(() => setClicked(false), 1200);
  };

  return (
    <>
      <Card className="optimize-action">
        <CardContent className="pt-6">
          <Button onClick={handleClick} size="lg" className="btn-optimize w-full">
            <Sparkles className="w-5 h-5 mr-2" />
            Optimize Resume & Generate New Version
            {clicked && (
              <span className="ml-3 inline-flex items-center" aria-hidden>
                <span className="w-4 h-4 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
              </span>
            )}
          </Button>
          <p className="optimize-note">
            This will generate an optimized resume with improved ATS score and better keyword
            className="btn-optimize w-full"
          </p>
        </CardContent>
      </Card>
      
      <PricingDialog open={showPricing} onClose={() => setShowPricing(false)} hideFreeTrial={trialBlocked} />
    </>
  );
};
