
const API = import.meta.env.VITE_API_URL || 'https://api.jobrabbit.ai';

export interface SubStatus {
  plan: 'free' | 'premium' | 'enterprise';
  usage: { count: number; remaining: number | null };
  resetsAt: string | null;
}


export const getStatus = async (): Promise<SubStatus> => {
  const res = await fetch(`${API}/subscription/status`, { credentials: 'include' });
  const { data } = await res.json();
  return data;
};


export const checkout = async (plan: 'premium' | 'enterprise') => {
  const res = await fetch(`${API}/subscription/checkout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  const { data } = await res.json();
  if (data?.url) window.location.href = data.url;
};


export const portal = async () => {
  const res = await fetch(`${API}/subscription/portal`, {
    method: 'POST',
    credentials: 'include',
  });
  const { data } = await res.json();
  // Return portal URL to caller so caller can decide how to open it (new tab, same tab, etc.)
  return data?.url || null;
};

export const canUse = (s: SubStatus): boolean =>
  s.plan !== 'free' || (s.usage.remaining ?? 0) > 0;

export const isLimitError = (res: Response) => res.status === 403;
