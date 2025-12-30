import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
export const initMixpanel = () => {
  const token = import.meta.env.VITE_MIXPANEL_TOKEN;
  
  if (!token) {
    console.warn('Mixpanel token not found. Analytics will be disabled.');
    return;
  }

  // Initialize Mixpanel
  mixpanel.init(token, {
    debug: import.meta.env.DEV,
    track_pageview: true, // Automatically track page views
    persistence: 'localStorage', // Store user data in localStorage
    ignore_dnt: false, // Respect Do Not Track
  });

  // Identify user if logged in
  const userId = localStorage.getItem('userId');
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

// Track page view
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  const mp = getMixpanel();
  if (mp) {
    mp.track('Page View', {
      page: pageName,
      ...properties,
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

