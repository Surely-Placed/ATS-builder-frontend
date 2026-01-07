import mixpanel from "mixpanel-browser";

// Initialize Mixpanel
export const initMixpanel = () => {
  const token = import.meta.env.VITE_MIXPANEL_TOKEN;

  if (!token) {
    // Mixpanel token not found - analytics disabled silently
    return;
  }

  // Initialize Mixpanel with all logging disabled
  mixpanel.init(token, {
    debug: false, // Disable debug mode to prevent console logs
    track_pageview: false, // Disable automatic page views - we'll track manually
    persistence: "localStorage", // Store user data in localStorage
    ignore_dnt: false, // Respect Do Not Track
    verbose: false, // Disable verbose logging
    batch_requests: true, // Batch requests to reduce logs
    loaded: (mp) => {
      // Suppress all console logs from Mixpanel
      mp.set_config({
        verbose: false,
        debug: false,
      });
    },
  });

  // Identify user if logged in
  const userId = localStorage.getItem("userId");
  if (userId) {
    mixpanel.identify(userId);
  }

  return mixpanel;
};

// Get Mixpanel instance (returns null if not initialized)
export const getMixpanel = () => {
  const token = import.meta.env.VITE_MIXPANEL_TOKEN;
  if (!token) {
    return null;
  }
  return mixpanel;
};

// Track event
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  const mp = getMixpanel();
  if (mp) {
    mp.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
};

// Identify user
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  const mp = getMixpanel();
  if (mp) {
    mp.identify(userId);
    if (userProperties) {
      mp.people.set(userProperties);
    }
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  const mp = getMixpanel();
  if (mp) {
    mp.people.set(properties);
  }
};

// Track home page visit
export const trackHomePageVisit = () => {
  const mp = getMixpanel();
  if (mp) {
    mp.track("Home Page Visits");
  }
};

// Track home page load time
export const trackHomePageLoadTime = (loadTime: number) => {
  const mp = getMixpanel();
  if (mp) {
    mp.track("Home Page Load Time", {
      load_time_ms: loadTime,
    });
  }
};

// Reset (on logout)
export const resetMixpanel = () => {
  const mp = getMixpanel();
  if (mp) {
    mp.reset();
  }
};
