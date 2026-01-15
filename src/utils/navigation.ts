/**
 * Navigation utility for programmatic routing outside of React components.
 * Used in axios interceptors and other non-component code.
 */

type NavigateFunction = (path: string, options?: { replace?: boolean }) => void;

let navigateRef: NavigateFunction | null = null;

/**
 * Set the navigate function from React Router.
 * Call this from a component that has access to useNavigate.
 */
export const setNavigate = (navigate: NavigateFunction) => {
  navigateRef = navigate;
};

/**
 * Navigate to a path using React Router.
 * Falls back to window.location.href if navigate is not set.
 */
export const navigate = (path: string, options?: { replace?: boolean }) => {
  if (navigateRef) {
    navigateRef(path, options);
  } else {
    // Fallback for cases where React Router is not available
    if (options?.replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  }
};

/**
 * Clear the navigate reference (for cleanup)
 */
export const clearNavigate = () => {
  navigateRef = null;
};
