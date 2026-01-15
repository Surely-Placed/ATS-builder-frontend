import React from "react";
import { analysisApiClient } from "@/services/analysis/apiClient";
import { updateUsageFromHeader, readUsageFromStorage } from "@/utils/usage";

// Simple React context store for usage
export type UsageState = { plan: 'free' | 'premium' | 'enterprise' | null; remaining: number | "unlimited" | null; limit: number | null };
const UsageContext = React.createContext<{ state: UsageState; refresh: () => Promise<void> } | null>(null);

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<UsageState>({ plan: null, remaining: null, limit: null });

  const setFromHeader = (headerValue?: string | null) => {
    console.debug("UsageContext: setFromHeader called with:", headerValue);
    if (!headerValue) return;
    // persist and notify listeners
    try {
      updateUsageFromHeader(headerValue);
    } catch (e) {
      // ignore
    }
    if (headerValue === "unlimited") {
      const newState = { ...(({} as any) as UsageState), remaining: "unlimited", limit: null } as any;
      console.debug("UsageContext: header indicates unlimited, setting state ->", newState);
      setState((s) => ({ ...s, remaining: "unlimited", limit: null }));
      return;
    }
    const n = parseInt(headerValue, 10);
    if (!Number.isNaN(n)) {
      console.debug("UsageContext: header numeric remaining ->", n);
      setState((s) => ({ ...s, remaining: n, limit: s.limit ?? 10 }));
    }
  };

  const refresh = React.useCallback(async () => {
    // Debounce/rate-limit refreshes: avoid calling the endpoint more than once every 30s
    const MIN_REFRESH_MS = 30 * 1000;
    const now = Date.now();
    if ((refresh as any)._lastCalled && now - (refresh as any)._lastCalled < MIN_REFRESH_MS) {
      return;
    }
    if ((refresh as any)._inFlight) {
      // reuse in-flight promise
      return (refresh as any)._inFlight;
    }
    try {
      (refresh as any)._lastCalled = now;
      // Prefer axios client (shares baseURL and interceptors) so requests go to configured API server.
      let inFlight: Promise<any>;
      try {
        inFlight = (analysisApiClient.get("/subscription/status", { withCredentials: true }) as any).then((r: any) => r.data?.data || r.data || r);
      } catch (e) {
        console.debug("UsageContext.refresh: axios request setup failed, falling back to fetch", e);
        inFlight = fetch("/api/subscription/status", { credentials: "include" }).then(async (r) => {
          if (!r.ok) throw r;
          return r.json();
        });
      }
      (refresh as any)._inFlight = inFlight;
      const res = await inFlight;
      (refresh as any)._inFlight = null;
      // backend may return { success: true, data: { plan, usage }} or direct data
      const payload = res?.data || res;
      console.debug("UsageContext.refresh: raw payload ->", payload);
      const plan = payload?.plan ?? null;
      const usage = payload?.usage || payload?.usageInfo || null;
      if (usage) {
        const newState = {
          plan,
          remaining: usage.remaining === null ? "unlimited" : usage.remaining,
          limit: usage.limit ?? undefined,
        } as any;
        console.debug("UsageContext.refresh: setting state ->", newState);
        setState((s) => ({ ...s, ...newState, limit: usage.limit ?? s.limit ?? 10 }));
      } else if (plan) {
        console.debug("UsageContext.refresh: setting plan ->", plan);
        setState((s) => ({ ...s, plan }));
      }
    } catch (err) {
      console.debug("UsageContext.refresh: error fetching subscription status ->", err);
      // ignore failures; keep previous state
      (refresh as any)._inFlight = null;
    }
  }, []);

  // install interceptor to capture X-Usage-Remaining header from any request
  React.useEffect(() => {
    const id = analysisApiClient.interceptors.response.use(
      (resp) => {
        setFromHeader(resp.headers?.["x-usage-remaining"]);
        return resp;
      },
      (err) => {
        const hdr = err?.response?.headers?.["x-usage-remaining"];
        setFromHeader(hdr);
        return Promise.reject(err);
      }
    );
    // initialize from storage (cross-tab or previous load)
    const stored = readUsageFromStorage();
    if (stored !== null) {
      setState((s) => ({
        ...s,
        remaining: stored as any,
        // set sensible defaults when only stored remaining is available
        limit: s.limit ?? 10,
        // do NOT assume a plan when only 'remaining' is stored; leave plan as-is
        plan: s.plan ?? null,
      }));
      // We still need to fetch authoritative plan/usage from the server when restoring
      // from storage, so call refresh() (it is debounced/in-flight-safe).
      refresh().catch(() => {});
    } else {
      // If we don't have any stored usage, perform a single refresh to populate initial state.
      // This keeps the UI accurate while still avoiding repeated calls.
      refresh().catch(() => {});
    }

    // listen for programmatic or cross-tab updates
    const onUpdate = (e: any) => {
      console.debug('UsageContext: usage:update event ->', e?.detail);
      const rem = e?.detail?.remaining;
      if (!rem && rem !== 0) return;
      const value = rem === 'unlimited' ? 'unlimited' : parseInt(rem, 10) || 0;
      // Do NOT default the plan to 'free' here. Leaving plan as-is prevents a
      // storage-driven update from incorrectly overwriting the authoritative
      // plan value when it hasn't yet been fetched.
      setState((s) => ({ ...s, remaining: value as any, limit: s.limit ?? 10, plan: s.plan ?? null }));
    };
    window.addEventListener('usage:update', onUpdate as EventListener);

    return () => {
      analysisApiClient.interceptors.response.eject(id);
      window.removeEventListener('usage:update', onUpdate as EventListener);
    };
  }, [refresh]);

  return <UsageContext.Provider value={{ state, refresh }}>{children}</UsageContext.Provider>;
};

// Hook to consume usage state
export function useUsage() {
  const ctx = React.useContext(UsageContext);
  if (!ctx) throw new Error("useUsage must be used inside UsageProvider");
  return ctx;
}

// Small UI component example
export function UsageBadge() {
  const { state } = useUsage();
  const remaining = state.remaining === "unlimited" ? "∞" : state.remaining ?? "-";
  const limit = state.limit ?? 10;
  const used = state.remaining === "unlimited" || state.remaining === null ? 0 : Math.max(0, limit - state.remaining);
  return (
    <div style={{ padding: 6, borderRadius: 12, background: "#666", color: "#fff", fontSize: 12 }}>
      <strong style={{ marginRight: 6 }}>{used}/{remaining}</strong> Free left
    </div>
  );
}
