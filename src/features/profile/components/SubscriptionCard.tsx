import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import PricingDialog from '@/components/shared/PricingDialog';
import type { Subscription } from "@/types/profile/overview";

interface SubscriptionCardProps {
  subscription: Subscription | null;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const [showPricing, setShowPricing] = useState(false);
  return (
    <Card className="border rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          Subscription Status
        </h3>
        {subscription ? (
          <div className="space-y-0">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">Plan:</span>
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold rounded-full border-0">
                {subscription.plan}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              <Badge
                className={`px-3 py-1 text-xs font-semibold rounded-full border-0 ${
                  subscription.active
                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                }`}
              >
                {subscription.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {!subscription.active && (
              <>
                <Button
                  onClick={() => setShowPricing(true)}
                  className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-sm font-semibold"
                >
                  Upgrade Plan
                </Button>
                <PricingDialog open={showPricing} onClose={() => setShowPricing(false)} />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-0">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">Plan:</span>
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold rounded-full border-0">
                Free
              </Badge>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              <Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 text-xs font-semibold rounded-full border-0">
                Inactive
              </Badge>
            </div>
            <>
              <Button
                onClick={() => setShowPricing(true)}
                className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-sm font-semibold"
              >
                Upgrade Plan
              </Button>
              <PricingDialog open={showPricing} onClose={() => setShowPricing(false)} />
            </>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
