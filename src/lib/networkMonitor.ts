/**
 * Network status monitoring utilities
 */

export type NetworkStatusCallback = (isOnline: boolean) => void;

/**
 * Monitor network status changes
 */
export const monitorNetworkStatus = (callback: NetworkStatusCallback): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Check if currently online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};
