import React, { useEffect, useState } from 'react';
import { getStatus } from '@/services/subscription';

export const SubscriptionDays: React.FC<{ className?: string }> = ({ className }) => {
  const [days, setDays] = useState<number | null | 'unknown'>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const status = await getStatus();
        // Prefer explicit daysRemaining if provided under resetsAt mapping
        if ((status as any).daysRemaining !== undefined && (status as any).daysRemaining !== null) {
          if (mounted) setDays(Math.max(0, Number((status as any).daysRemaining)));
        } else if (status.resetsAt) {
          const reset = new Date(status.resetsAt);
          const now = new Date();
          const msPerDay = 24 * 60 * 60 * 1000;
          const diff = Math.ceil((reset.getTime() - now.getTime()) / msPerDay);
          if (mounted) setDays(diff <= 0 ? 0 : diff);
        } else {
          if (mounted) setDays('unknown');
        }
      } catch (e) {
        if (mounted) setDays('unknown');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;
  if (days === 'unknown' || days === null) return null;
  return (
    <span className={className}>
      · {days === 0 ? 'Reset today' : `${days} day${days === 1 ? '' : 's'} left`}
    </span>
  );
};

export default SubscriptionDays;
