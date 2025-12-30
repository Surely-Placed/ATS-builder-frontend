import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView as trackMixpanelPageView } from '../config/mixpanel';
import { trackPageView } from '../utils/analytics';

/**
 * Component to automatically track page views
 * Add this inside BrowserRouter but outside Routes
 */
export const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view in both Mixpanel and Firebase
    const pageName = location.pathname === '/' ? 'Home' : location.pathname.slice(1).replace(/-/g, ' ');
    
    trackPageView(pageName, location.pathname);
    trackMixpanelPageView(pageName, {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
    });
  }, [location]);

  return null;
};

