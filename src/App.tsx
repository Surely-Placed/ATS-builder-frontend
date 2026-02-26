import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import { UsageProvider } from "./context/UsageContext";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import { PageViewTracker } from "@/components/system/PageViewTracker";
import { NavigationSetter } from "@/components/system/NavigationSetter";

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
const SubscriptionSuccess = lazyWithRetry(() => import("./pages/SubscriptionSuccess"));
const SubscriptionCancel = lazyWithRetry(() => import("./pages/SubscriptionCancel"));
const Resume = lazyWithRetry(() => import("./pages/Resume"));
const ResumeAnalysis = lazyWithRetry(() => import("./pages/ResumeAnalysis"));
const ResumeResult = lazyWithRetry(() => import("./pages/ResumeResult"));
const ViewAnalysis = lazyWithRetry(() => import("./pages/ViewAnalysis"));
const Profile = lazyWithRetry(() => import("./pages/Profile"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazyWithRetry(() => import("./pages/TermsOfService"));
const CookiePolicy = lazyWithRetry(() => import("./pages/CookiePolicy"));
const Disclaimer = lazyWithRetry(() => import("./pages/Disclaimer"));
const Meeting = lazyWithRetry(() => import("./pages/Meeting"));
const MeetingCancel = lazyWithRetry(() => import("./pages/MeetingCancel"));
const InterviewPacketsDashboard = lazyWithRetry(() => import("./pages/InterviewPacketsDashboard"));
const InterviewPacketBuyPage = lazyWithRetry(() => import("./pages/InterviewPacketBuyPage"));
const InterviewPacketDetailPage = lazyWithRetry(
  () => import("./pages/InterviewPacketDetailPage")
);
const InterviewFollowUpPage = lazyWithRetry(
  () => import("./pages/InterviewFollowUpPage")
);

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
              <NavigationSetter />
              <PageViewTracker />
              <AuthProvider>
                <UsageProvider>
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
                      <Route path="/resume" element={<Resume />} />
                      <Route path="/resume-analysis" element={<ResumeAnalysis />} />
                      <Route path="/resume-result" element={<ResumeResult />} />
                      <Route path="/analysis/:id" element={<ViewAnalysis />} />
                      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                      <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
                      {/* Legacy/alternate billing callback URLs (payment provider redirects) */}
                      <Route path="/billing/success" element={<SubscriptionSuccess />} />
                      <Route path="/billing/cancel" element={<SubscriptionCancel />} />
                      {/* Interview Packet one-time purchase callbacks */}
                      <Route path="/interview-packet/success" element={<SubscriptionSuccess />} />
                      <Route path="/interview-packet/cancel" element={<SubscriptionCancel />} />
                      {/* Legacy/alternate interview packet callback URLs (payment provider redirects) */}
                      <Route path="/interview-packets/success" element={<SubscriptionSuccess />} />
                      <Route path="/interview-packets/cancel" element={<SubscriptionCancel />} />
                      <Route path="/profile/*" element={<Profile />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                      <Route path="/disclaimer" element={<Disclaimer />} />
                      <Route path="/interview-packet" element={<InterviewPacketsDashboard />} />
                      <Route path="/interview-packet/:id" element={<InterviewPacketDetailPage />} />
                      <Route path="/interview-packet/buy" element={<InterviewPacketBuyPage />} />
                      <Route path="/interview-packet/follow-up" element={<InterviewFollowUpPage />} />
                      <Route path="/meeting" element={<Meeting />} />
                      <Route path="/meeting/success" element={<SubscriptionSuccess />} />
                      <Route path="/meeting/cancel" element={<MeetingCancel />} />
                      {/* /meetings (no trailing path): Stripe success URL may redirect here with ?session_id=... */}
                      <Route path="/meetings" element={<Meeting />} />
                      <Route path="/meetings/success" element={<SubscriptionSuccess />} />
                      <Route path="/meetings/cancel" element={<MeetingCancel />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
                </UsageProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
