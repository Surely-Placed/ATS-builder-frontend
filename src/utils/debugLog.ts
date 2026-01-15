// Debug logging utility (noop in production)
export const debugAdd = (_message: string, _meta?: any) => {
  // no-op
};

export const getDebugLogs = () => [] as Array<{ts: string; message: string; meta?: any}>;

export const subscribeDebug = (_cb: any) => {
  return () => {};
};
