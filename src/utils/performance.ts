/**
 * Performance monitoring and optimization utilities
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
}

/**
 * Measure and report Web Vitals
 */
export const measureWebVitals = (): void => {
  if (typeof window === "undefined") return;

  // Measure Largest Contentful Paint (LCP)
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          renderTime?: number;
          loadTime?: number;
        };

        const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        if (lcp > 0) {
          console.log("LCP:", lcp);
          // Send to analytics
          if (import.meta.env.PROD) {
            // Example: analytics.track('web_vital', { metric: 'LCP', value: lcp });
          }
        }
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.warn("LCP measurement not supported", e);
    }
  }

  // Measure First Input Delay (FID)
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          console.log("FID:", fid);
          if (import.meta.env.PROD) {
            // Example: analytics.track('web_vital', { metric: 'FID', value: fid });
          }
        });
      });

      observer.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.warn("FID measurement not supported", e);
    }
  }

  // Measure Cumulative Layout Shift (CLS)
  if ("PerformanceObserver" in window) {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log("CLS:", clsValue);
        if (import.meta.env.PROD) {
          // Example: analytics.track('web_vital', { metric: 'CLS', value: clsValue });
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.warn("CLS measurement not supported", e);
    }
  }
};

/**
 * Measure page load time
 */
export const measurePageLoad = (): PerformanceMetric | null => {
  if (typeof window === "undefined" || !window.performance) return null;

  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

  if (!navigation) return null;

  return {
    name: "Page Load Time",
    value: navigation.loadEventEnd - navigation.fetchStart,
    unit: "ms",
  };
};

/**
 * Measure time to interactive
 */
export const measureTTI = (): PerformanceMetric | null => {
  if (typeof window === "undefined" || !window.performance) return null;

  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

  if (!navigation) return null;

  return {
    name: "Time to Interactive",
    value: navigation.domInteractive - navigation.fetchStart,
    unit: "ms",
  };
};

/**
 * Prefetch resources
 */
export const prefetchResource = (url: string, as: string = "script"): void => {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
};

/**
 * Preload critical resources
 */
export const preloadResource = (url: string, as: string, type?: string): void => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = as;
  link.href = url;
  if (type) {
    link.type = type;
  }
  document.head.appendChild(link);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
