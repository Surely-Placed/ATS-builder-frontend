import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate, clearNavigate } from "@/utils/navigation";

/**
 * Component that sets up the navigation utility for use outside of React components.
 * Must be rendered inside BrowserRouter.
 */
export const NavigationSetter = () => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  // Keep the ref updated without triggering effects
  useEffect(() => {
    navigateRef.current = navigate;
  });

  // Set up the navigation utility only once on mount
  useEffect(() => {
    setNavigate((path, options) => navigateRef.current(path, options));
    return () => {
      clearNavigate();
    };
  }, []);

  return null;
};
