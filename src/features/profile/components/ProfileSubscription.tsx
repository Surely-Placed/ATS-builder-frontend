import React, { useEffect, useState } from 'react';
import { getStatus, portal, SubStatus } from '@/features/subscription/services/subscriptionService';
import { useUsage } from '@/context/UsageContext';
import { trackBillingPortalOpen } from '@/utils/analytics';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, Clock, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfileSubscription() {
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await getStatus();
      setStatus(s as SubStatus);
    } catch (e: any) {
      setError(e?.message || 'Failed to load subscription status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Refresh subscription status when the window/tab regains focus or becomes visible
  const { refresh: refreshUsage } = useUsage();

  useEffect(() => {
    const onFocus = () => {
      loadStatus();
      // also refresh usage context so dashboard/badges update
      try {
        refreshUsage().catch(() => {});
      } catch (_) {}
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refreshUsage]);

  if (loading)
    return (
      <div>
        <Button disabled>
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading subscription...
        </Button>
      </div>
    );

  if (error)
    return (
      <div>
        <p className="text-destructive">Error loading subscription: {error}</p>
        <Button onClick={loadStatus} className="mt-2">Retry</Button>
      </div>
    );

  if (!status)
    return (
      <div>
        <Button onClick={loadStatus}>Load Subscription Status</Button>
      </div>
    );

  const computeDaysRemaining = (): number | null => {
    if ((status as any).daysRemaining !== undefined && (status as any).daysRemaining !== null) {
      return Math.max(0, Number((status as any).daysRemaining));
    }
    if (status.resetsAt) {
      const reset = new Date(status.resetsAt);
      const now = new Date();
      const msPerDay = 24 * 60 * 60 * 1000;
      const diff = Math.ceil((reset.getTime() - now.getTime()) / msPerDay);
      return diff <= 0 ? 0 : diff;
    }
    return null;
  };

  const daysRemaining = computeDaysRemaining();

  return (
    <div className="space-y-6 pl-0 pr-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Plan</h3>
            </div>
            <p className="text-2xl font-bold capitalize">{status.plan}</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-3">
              {status.plan !== 'free' && daysRemaining !== 0 ? (
                <div className="w-5 h-5 rounded-full bg-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <h3 className="font-semibold">Status</h3>
            </div>
            <Badge
              variant={status.plan !== 'free' && daysRemaining !== 0 ? 'default' : 'destructive'}
              className="text-base px-3 py-1"
            >
              {status.plan !== 'free' && daysRemaining !== 0 ? 'Active' : 'Plan expired'}
            </Badge>
          </CardContent>
        </Card>

        {daysRemaining !== null && (
          <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Days Remaining</h3>
              </div>
              <p className={`text-2xl font-bold ${daysRemaining < 7 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {daysRemaining}
              </p>
              <p className="text-sm text-muted-foreground mt-1">days</p>
            </CardContent>
          </Card>
        )}

        {status.plan !== 'free' && (
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
                  onClick={async () => {
                    const url = await portal();
                    if (url) window.location.href = url;
                  }}
                  variant="destructive"
                  className="w-full"
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
