import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Allow connections from any network interface (for mobile testing)
    port: 8080,
    strictPort: false, // Allow using next available port if 5173 is taken
    hmr: {
      overlay: true,
      host: "localhost", // HMR host
    },
    watch: {
      usePolling: true,
    },
    // Enable CORS for mobile testing
    cors: true,
  },
  plugins: [react()],
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: mode === "development",
    commonjsOptions: {
      // Ensure React and other CommonJS modules are treated correctly
      include: [
        /react/,
        /react-dom/,
        /react-helmet-async/,
        /shallowequal/,
        /invariant/,
        /react-fast-compare/,
        /node_modules/,
      ],
      transformMixedEsModules: true,
      // Handle default exports from CommonJS modules
      defaultIsModuleExports: "auto",
      // Require returns default for CommonJS modules
      requireReturnsDefault: "auto",
    },
    rollupOptions: {
      // Fix for shallowequal import in react-helmet-async
      output: {
        // Handle CommonJS interop
        interop: "auto",
        manualChunks: (id) => {
          // Handle node_modules
          if (id.includes("node_modules")) {
            // DO NOT split React - it must be in the entry chunk to avoid "createContext" errors
            // React and React DOM stay in the main bundle for synchronous loading
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              (id.includes("react") &&
                !id.includes("react-router") &&
                !id.includes("@react") &&
                !id.includes("react-helmet"))
            ) {
              // Return undefined to keep React in the entry chunk
              return undefined;
            }
            // React Router - depends on React, so separate chunk
            if (id.includes("react-router")) {
              return "react-router-vendor";
            }
            // Firebase - handle separately to avoid resolution issues
            if (id.includes("firebase")) {
              return "firebase-vendor";
            }
            // Radix UI components
            if (id.includes("@radix-ui")) {
              return "ui-vendor";
            }
            // React Query
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            // Motion libraries
            if (id.includes("framer-motion") || id.includes("/motion")) {
              return "motion-vendor";
            }
            // Utility libraries
            if (
              id.includes("axios") ||
              id.includes("date-fns") ||
              id.includes("zod") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "utils-vendor";
            }
            // Other large vendor libraries
            if (
              id.includes("socket.io") ||
              id.includes("recharts") ||
              id.includes("@tsparticles")
            ) {
              return "other-vendor";
            }
            // Default vendor chunk for other node_modules
            return "vendor";
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split("/").pop()
            : "chunk";
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-router-dom",
      "@tanstack/react-query",
      "framer-motion",
      "firebase/app",
      "firebase/auth",
    ],
    exclude: [],
    esbuildOptions: {
      // Ensure React is processed correctly
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
    // Fix for shallowequal default export issue
    conditions: ["import", "module", "browser", "default"],
  },
  // Fix for react-helmet-async shallowequal import
  define: {
    // Ensure proper module resolution
  },
}));
