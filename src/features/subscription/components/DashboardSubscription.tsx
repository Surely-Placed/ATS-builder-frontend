import React, { useEffect, useState } from 'react';
// Use the fetched subscription data to compute days remaining

type SubscriptionInfo = {
  plan: string;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  subscriptionId?: string | null;
  isExpired: boolean;
  daysRemaining: number | null;
};

export default function DashboardSubscription({ className }: { className?: string }) {
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchSub = async () => {
      try {
        const res = await fetch('/api/subscription/status', { credentials: 'include' });
        if (!mounted) return;
        const raw = await res.clone().text().catch(() => null);
        console.debug('DashboardSubscription: /api/subscription/status ->', res.status, raw);
        if (res.status === 401) {
          setSub(null);
          return;
        }
        if (!res.ok) {
          setSub(null);
          return;
        }
        const body = await res.json();
        const data = body?.data;
        if (data) setSub(data as SubscriptionInfo);
      } catch (err) {
        console.debug('DashboardSubscription: fetch error', err);
        setSub(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSub();
    return () => {
      mounted = false;
    };
  }, []);

  const planRaw = sub?.plan ?? null;
  const planStr = typeof planRaw === 'string' ? planRaw.toLowerCase() : '';

  let normalized: 'free' | 'premium' | 'enterprise' | 'unknown' = 'unknown';
  if (!planStr || planStr === 'free') normalized = 'free';
  else if (planStr === 'premium' || planStr.includes('pro') || planStr.includes('plus')) normalized = 'premium';
  else if (planStr.includes('enterprise') || planStr.includes('corp')) normalized = 'enterprise';

  const computeDaysRemaining = (s: SubscriptionInfo | null): number | null => {
    if (!s) return null;
    if ((s as any).daysRemaining !== undefined && (s as any).daysRemaining !== null) {
      return Math.max(0, Number((s as any).daysRemaining));
    }
    // Some responses provide `resetsAt` instead of explicit daysRemaining
    if ((s as any).resetsAt) {
      const reset = new Date((s as any).resetsAt);
      const now = new Date();
      const msPerDay = 24 * 60 * 60 * 1000;
      const diff = Math.ceil((reset.getTime() - now.getTime()) / msPerDay);
      return diff <= 0 ? 0 : diff;
    }
    return null;
  };

  const days = computeDaysRemaining(sub);
  const daysDisplay = days === null ? '—' : `${days} day${days === 1 ? '' : 's'}`;
  const planDisplay = planRaw ? (planRaw.charAt(0).toUpperCase() + planRaw.slice(1)) : 'Free';

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      {/* Subscription text removed per request */}
    </div>
  );
}
