import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { measureWebVitals } from "./utils/performance";
import { setupChunkErrorHandler } from "./utils/chunkErrorHandler";
import { initMixpanel } from "./config/mixpanel";

// Initialize Mixpanel
initMixpanel();

// Setup chunk error handling and Web Vitals in production
if (import.meta.env.PROD) {
  setupChunkErrorHandler();
  measureWebVitals();
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
