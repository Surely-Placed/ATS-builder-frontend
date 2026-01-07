import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCRPyd-Um-UN9rxUIt9XW8bDcTBz0xMX40",
  authDomain: "airesumebuilder-60f9e.firebaseapp.com",
  projectId: "airesumebuilder-60f9e",
  storageBucket: "airesumebuilder-60f9e.firebasestorage.app",
  messagingSenderId: "765427554416",
  appId: "1:765427554416:web:48edaa1685f6d1e8577cb5",
  measurementId: "G-8HW9NGZ26Q",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set persistence to LOCAL so users stay logged in even after closing the tab
// This ensures the session persists across browser sessions
// IMPORTANT: This must be set before any auth operations
if (typeof window !== "undefined") {
  // Set persistence immediately and ensure it's applied
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Silently fail - persistence will use default
  });
}

// Initialize Analytics only in browser environment and production
// Skip analytics on localhost to prevent cookie domain errors
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  const hostname = window.location.hostname;
  // Only initialize analytics in production (not localhost or local IPs)
  const isProduction =
    hostname !== "localhost" &&
    !hostname.includes("127.0.0.1") &&
    !hostname.includes("0.0.0.0") &&
    hostname !== "127.0.0.1";

  if (isProduction) {
    // Initialize analytics in production environment with error handling
    // This prevents cookie domain errors from breaking the app
    isSupported()
      .then((supported) => {
        if (supported) {
          try {
            analytics = getAnalytics(app);
          } catch (error) {
            // Silently fail to prevent cookie domain errors from breaking the app
            // This can happen if the domain is not authorized in Google Analytics
            console.warn(
              "Firebase Analytics initialization failed (cookie domain issue may occur):",
              error
            );
            analytics = null;
          }
        }
      })
      .catch((error) => {
        // Silently fail if analytics is not supported
        console.warn("Firebase Analytics not supported:", error);
      });
  }
}

export { analytics };
