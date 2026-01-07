import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import { PageViewTracker } from "@/components/system/PageViewTracker";

// Lazy load pages for code splitting with error handling
const lazyWithRetry = (componentImport: () => Promise<any>) => {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error("Failed to load chunk:", error);
      // Retry once after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        return await componentImport();
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        throw retryError;
      }
    }
  });
};

const Index = lazyWithRetry(() => import("./pages/Index"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const VerifyEmail = lazyWithRetry(() => import("./pages/VerifyEmail"));
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard"));
const Documents = lazyWithRetry(() => import("./pages/Documents"));
const ResumeAnalysis = lazyWithRetry(() => import("./pages/ResumeAnalysis"));
const ResumeOptimization = lazyWithRetry(() => import("./pages/ResumeOptimization"));
const ResumePreview = lazyWithRetry(() => import("./pages/ResumePreview"));
const Profile = lazyWithRetry(() => import("./pages/Profile"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazyWithRetry(() => import("./pages/TermsOfService"));
const CookiePolicy = lazyWithRetry(() => import("./pages/CookiePolicy"));
const Disclaimer = lazyWithRetry(() => import("./pages/Disclaimer"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <PageViewTracker />
              <AuthProvider>
                <ErrorBoundary
                  fallback={
                    <div className="min-h-screen flex items-center justify-center bg-background p-4">
                      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 space-y-4 text-center">
                        <h1 className="text-2xl font-bold">Failed to Load</h1>
                        <p className="text-muted-foreground">
                          Unable to load the application. Please refresh the page.
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        >
                          Refresh Page
                        </button>
                      </div>
                    </div>
                  }
                >
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Index />} />
                      <Route path="/signup" element={<Index />} />
                      <Route path="/verify-email" element={<VerifyEmail />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/resume-analysis" element={<ResumeAnalysis />} />
                      <Route path="/resume-optimization" element={<ResumeOptimization />} />
                      <Route path="/resume-preview/:analysisId" element={<ResumePreview />} />
                      <Route path="/profile/*" element={<Profile />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                      <Route path="/disclaimer" element={<Disclaimer />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
