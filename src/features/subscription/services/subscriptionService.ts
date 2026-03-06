
import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "https://api.jobrabbit.ai";

const CURRENT_TERMS_VERSION = "refund-policy-v1-2026-02-24";

// ---------------------------------------------------------------------------
// Lightweight status used in existing components (e.g. SubscriptionBadges)
// ---------------------------------------------------------------------------
export interface SubStatus {
  plan: "free" | "premium" | "enterprise";
  usage: { count: number; remaining: number | null };
  resetsAt: string | null;
  // Optional fields that may be present from the richer status below
  daysRemaining?: number | null;
}

export const getStatus = async (): Promise<SubStatus> => {
  const res = await fetch(`${API}/subscription/status`, { credentials: "include" });
  const { data } = await res.json();
  return data;
};

// ---------------------------------------------------------------------------
// Rich subscription status + helpers (for analysis limits, UX messaging)
// ---------------------------------------------------------------------------
export type PlanType = "free" | "premium" | "enterprise";

export interface SubscriptionUsage {
  count: number;
  limit: number | null;
  remaining: number | null;
}

export interface SubscriptionStatus {
  plan: PlanType;
  active: boolean;
  startDate: string;
  endsAt: string;
  subscriptionId: string;
  isExpired: boolean;
  daysRemaining: number | null;
  usage: SubscriptionUsage;
  resetsAt: string;
}

export async function fetchSubscriptionStatus(): Promise<SubscriptionStatus> {
  const res = await fetch(`${API}/subscription/status`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch subscription status: ${res.status}`);
  }
  const json = await res.json();
  return json.data as SubscriptionStatus;
}

export function canRunAnalysis(status: SubscriptionStatus | null | undefined): boolean {
  if (!status) return false;

  if (!status.active || status.isExpired) return false;

  if (status.plan === "premium" || status.plan === "enterprise") {
    if (status.daysRemaining !== null && status.daysRemaining <= 0) return false;
    return true;
  }

  const remaining = status.usage?.remaining;
  if (remaining === null) return true;
  return remaining > 0;
}

export function useSubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const s = await fetchSubscriptionStatus();
      setStatus(s);
    } catch (e: any) {
      setError(e?.message || "Failed to load subscription status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    status,
    loading,
    error,
    canAnalyze: canRunAnalysis(status),
    refresh,
  };
}

// ---------------------------------------------------------------------------
// Checkout / portal helpers (existing)
// ---------------------------------------------------------------------------
export const checkout = async (plan: "premium" | "enterprise") => {
  const legacyConsent = {
    accepted: true,
    acceptedAt: new Date().toISOString(),
    termsVersion: CURRENT_TERMS_VERSION,
  };

  const res = await fetch(`${API}/subscription/checkout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan,
      // New flat fields required by backend
      refund_policy_accepted: true,
      terms_version: CURRENT_TERMS_VERSION,
      // Legacy nested object for backwards compatibility
      refund_policy_consent: legacyConsent,
    }),
  });
  const json = await res.json();
  const url = json?.data?.url ?? json?.url;
  if (url) {
    window.location.href = url;
  }
};


export const portal = async () => {
  const res = await fetch(`${API}/subscription/portal`, {
    method: "POST",
    credentials: "include",
  });
  const { data } = await res.json();
  // Return portal URL to caller so caller can decide how to open it (new tab, same tab, etc.)
  return data?.url || null;
};

export const canUse = (s: SubStatus): boolean =>
  s.plan !== "free" || (s.usage.remaining ?? 0) > 0;

export const isLimitError = (res: Response) => res.status === 403;
