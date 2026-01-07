import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackHomePageVisit, trackHomePageLoadTime } from "@/config/mixpanel";

/**
 * Component to track only home page visits and load time
 */
export const PageViewTracker = () => {
  const location = useLocation();
  const hasTrackedLoadTime = useRef(false);

  useEffect(() => {
    // Only track home page visits (root path)
    if (location.pathname === "/") {
      trackHomePageVisit();

      // Track load time for home page (only once)
      if (!hasTrackedLoadTime.current) {
        hasTrackedLoadTime.current = true;

        // Use Performance API to measure load time
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          const loadTime = timing.loadEventEnd - timing.navigationStart;

          if (loadTime > 0) {
            trackHomePageLoadTime(Math.round(loadTime));
          } else {
            // Fallback: wait for load event
            window.addEventListener(
              "load",
              () => {
                const finalLoadTime =
                  window.performance.timing.loadEventEnd -
                  window.performance.timing.navigationStart;
                if (finalLoadTime > 0) {
                  trackHomePageLoadTime(Math.round(finalLoadTime));
                }
              },
              { once: true }
            );
          }
        } else {
          // Modern Performance API fallback
          window.addEventListener(
            "load",
            () => {
              const perfData = window.performance.getEntriesByType(
                "navigation"
              )[0] as PerformanceNavigationTiming;
              if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                trackHomePageLoadTime(Math.round(loadTime));
              }
            },
            { once: true }
          );
        }
      }
    }
  }, [location]);

  return null;
};


