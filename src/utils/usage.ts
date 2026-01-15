// Utilities for persisting usage header and notifying UI
export function updateUsageFromHeader(headerValue?: string | null) {
  if (!headerValue) return;
  const remaining = headerValue === 'unlimited' ? 'unlimited' : String(parseInt(headerValue as string, 10) || 0);
  try {
    localStorage.setItem('usage_remaining', remaining);
    window.dispatchEvent(new CustomEvent('usage:update', { detail: { remaining } }));
  } catch (e) {
    // ignore storage errors
  }
}

export function readUsageFromStorage() {
  try {
    const val = localStorage.getItem('usage_remaining');
    if (!val) return null;
    return val === 'unlimited' ? 'unlimited' : parseInt(val, 10) || 0;
  } catch (e) {
    return null;
  }
}
