import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useUsage } from '@/context/UsageContext';
import SubscriptionDays from '@/features/subscription/components/SubscriptionDays';

export default function FreeTrialUsage() {
  const { state } = useUsage();
  console.debug('FreeTrialUsage render - usage state:', state);
  const plan = state.plan;
  const rawRemaining = state.remaining;
  const limit = state.limit ?? 10;

  // Free plan: show remaining/limit (show placeholder if unknown)
  if (plan === 'free') {
    const remainingDisplay = rawRemaining === 'unlimited' ? '∞' : rawRemaining === null ? '-' : rawRemaining;
    const titleText = rawRemaining === 'unlimited' ? 'Unlimited' : rawRemaining === null ? 'Free trial' : `${rawRemaining} remaining out of ${limit}`;

    return (
      <Button
        variant="ghost"
        className="bg-black text-white dark:bg-white dark:text-black border-none px-3 py-1 rounded-full font-semibold text-xs shadow-md cursor-default flex items-center gap-1 min-w-0"
        disabled
        title={titleText}
        aria-label={titleText}
        style={{ minWidth: 0, height: 28, lineHeight: 1 }}
      >
        <Sparkles className="w-3.5 h-3.5 mr-1 text-yellow-400" />
        {remainingDisplay}/{limit} Free left
      </Button>
    );
  }

  // Premium plan: green badge
  if (plan === 'premium') {
    return (
      <Button
        variant="ghost"
        className="bg-emerald-600 text-white border-none px-3 py-1 rounded-full font-semibold text-xs shadow-md cursor-default flex items-center gap-1 min-w-0"
        disabled
        title="Premium Plan"
        aria-label="Premium Plan"
        style={{ minWidth: 0, height: 28, lineHeight: 1 }}
      >
        <Sparkles className="w-3.5 h-3.5 mr-1 text-white" />
        <span className="flex items-center gap-2">
          <span>Premium</span>
          <SubscriptionDays className="text-xs text-white/90" />
        </span>
      </Button>
    );
  }

  // Enterprise plan: red badge
  if (plan === 'enterprise') {
    return (
      <Button
        variant="ghost"
        className="bg-red-600 text-white border-none px-3 py-1 rounded-full font-semibold text-xs shadow-md cursor-default flex items-center gap-1 min-w-0"
        disabled
        title="Enterprise Plan"
        aria-label="Enterprise Plan"
        style={{ minWidth: 0, height: 28, lineHeight: 1 }}
      >
        <Sparkles className="w-3.5 h-3.5 mr-1 text-white" />
        <span className="flex items-center gap-2">
          <span>Enterprise</span>
          <SubscriptionDays className="text-xs text-white/90" />
        </span>
      </Button>
    );
  }

  return null;
}
