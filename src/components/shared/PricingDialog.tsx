import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import PricingSection from '@/components/sections/PricingSection';
import { trackModalOpen } from '@/utils/analytics';

interface PricingDialogProps {
  open: boolean;
  onClose: () => void;
}

const PricingDialog: React.FC<PricingDialogProps & { hideFreeTrial?: boolean }> = ({ open, onClose, hideFreeTrial = false }) => {
  useEffect(() => {
    if (open) trackModalOpen('pricing');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-3xl max-h-[80vh] overflow-auto">
        <div className="bg-white dark:bg-card rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Choose a Plan</DialogTitle>
            <DialogDescription className="mb-2 text-sm text-muted-foreground">Upgrade to continue using premium features.</DialogDescription>
          </DialogHeader>

          <div>
            <PricingSection hideFreeTrial={hideFreeTrial} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingDialog;
