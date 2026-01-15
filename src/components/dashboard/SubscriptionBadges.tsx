import React, { useEffect, useState } from 'react';
import { getStatus, SubStatus } from '@/services/subscription';
import { Badge } from '@/components/ui/badge';
import { Gift, Crown, Server, Loader2 } from 'lucide-react';

export default function SubscriptionBadges() {
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const s = await getStatus();
        if (mounted) setStatus(s as SubStatus);
      } catch (err) {
        console.error('Failed to load subscription status', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const computeDaysRemaining = (s: SubStatus | null): number | null => {
    if (!s) return null;
    if ((s as any).daysRemaining !== undefined && (s as any).daysRemaining !== null) {
      return Math.max(0, Number((s as any).daysRemaining));
    }
    if (s.resetsAt) {
      const reset = new Date(s.resetsAt);
      const now = new Date();
      const msPerDay = 24 * 60 * 60 * 1000;
      const diff = Math.ceil((reset.getTime() - now.getTime()) / msPerDay);
      return diff <= 0 ? 0 : diff;
    }
    return null;
  };

  const days = computeDaysRemaining(status);

  const renderIcon = () => {
    if (!status) return <Gift className="w-4 h-4 text-primary" />;
    if (status.plan === 'premium') return <Crown className="w-4 h-4 text-amber-500" />;
    if (status.plan === 'enterprise') return <Server className="w-4 h-4 text-sky-500" />;
    return <Gift className="w-4 h-4 text-primary" />;
  };

  const renderValue = () => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!status) return <span className="text-xs text-muted-foreground">Unknown</span>;

    if (status.plan === 'free') {
      const remaining = typeof status.usage?.remaining === 'number' ? status.usage!.remaining : (status.usage as any)?.remaining ?? 0;
      const total = 10; // fixed total for free trial
      return (
        <Badge variant="secondary" className="text-sm rounded-full px-2 py-0.5">
          {remaining}/{total}
        </Badge>
      );
    }

    // premium or enterprise
    const d = days;
    if (d === null) return <Badge className="text-sm">Active</Badge>;
    return <Badge className="text-sm">{d} days</Badge>;
  };

  return (
    <div className="mt-3">
      <div className="inline-flex items-center gap-3 rounded-md px-2 py-1 bg-muted/30 border border-border">
        <div className="flex items-center">{renderIcon()}</div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">{status?.plan === 'free' ? 'Free-trial' : status?.plan?.charAt(0).toUpperCase() + status?.plan?.slice(1)}</span>
        </div>
        <div>{renderValue()}</div>
      </div>
    </div>
  );
}
