import React from 'react';
import { useUsage } from '@/context/UsageContext';

export default function SubscriptionBadge({ className }: { className?: string }) {
  const { state } = useUsage();
  const plan = state.plan ?? null;
  const rawRemaining = state.remaining;

  const planDisplay = plan ? (String(plan).charAt(0).toUpperCase() + String(plan).slice(1)) : 'Free';
  const remainingDisplay = rawRemaining === 'unlimited' ? '∞' : rawRemaining === null ? '—' : String(rawRemaining);

  return (
    <div className={className ?? ''} aria-hidden>
      <span className="text-sm font-semibold">{planDisplay} · {remainingDisplay}</span>
    </div>
  );
}
