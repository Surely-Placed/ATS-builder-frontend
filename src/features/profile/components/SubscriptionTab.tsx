import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Crown, Calendar, Clock, XCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { portal } from '@/features/subscription/services/subscriptionService';
import { trackBillingPortalOpen } from '@/utils/analytics';

interface Subscription {
  plan: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  isExpired: boolean;
  daysRemaining: number | null;
}

interface SubscriptionTabProps {
  subscription: Subscription | null;
  onCancel: () => Promise<void>;
  cancelling: boolean;
}

export const SubscriptionTab = ({ subscription, onCancel, cancelling }: SubscriptionTabProps) => {
  return (
    <div className="space-y-6 pl-0 pr-0">
      {subscription ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Plan</h3>
              </div>
              <p className="text-2xl font-bold capitalize">{subscription.plan}</p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {subscription.active && !subscription.isExpired && subscription.daysRemaining !== 0 ? (
                  <div className="w-5 h-5 rounded-full bg-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <h3 className="font-semibold">Status</h3>
              </div>
              <Badge
                variant={
                  subscription.active && !subscription.isExpired && subscription.daysRemaining !== 0
                    ? "default"
                    : "destructive"
                }
                className="text-base px-3 py-1"
              >
                {subscription.active && !subscription.isExpired && subscription.daysRemaining !== 0
                  ? "Active"
                  : "Plan expired"}
              </Badge>
            </CardContent>
          </Card>

          {subscription.endDate && (
            <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Expires</h3>
                </div>
                <p className="text-lg font-semibold">
                  {new Date(subscription.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          )}

          {subscription.daysRemaining !== null && (
            <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Days Remaining</h3>
                </div>
                <p
                  className={`text-2xl font-bold ${subscription.daysRemaining < 7 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {subscription.daysRemaining}
                </p>
                <p className="text-sm text-muted-foreground mt-1">days</p>
              </CardContent>
            </Card>
          )}

          {subscription.active && (
            <Card className="border border-destructive/50 bg-muted/30 hover:bg-muted/50 transition-colors md:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Subscription Management</h3>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={async () => {
                      try {
                        const url = await portal();
                        if (url) {
                          window.open(url, '_blank', 'noopener,noreferrer');
                          trackBillingPortalOpen();
                        }
                      } catch (err) {
                        console.error('Failed to open billing portal', err);
                      }
                    }}
                    className="w-full"
                  >
                    Manage Billing
                  </Button>

                  <Button
                    onClick={onCancel}
                    variant="destructive"
                    disabled={cancelling}
                    className="w-full gap-2"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Cancel Subscription
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <p className="text-muted-foreground">No subscription information available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
