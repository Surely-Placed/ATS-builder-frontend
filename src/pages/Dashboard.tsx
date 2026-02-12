import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { GetStartedCard } from "@/features/dashboard/components/GetStartedCard";
import { EmptyActivityCard } from "@/features/dashboard/components/EmptyActivityCard";
import { RecentActivityCard } from "@/features/dashboard/components/RecentActivityCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { FileText, TrendingUp, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useUsage } from '@/context/UsageContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SubscriptionBadges from '@/features/dashboard/components/SubscriptionBadges';

const Dashboard = () => {
  const [page, setPage] = React.useState(1);
  const { stats, loading, error, refetch, totalPages } = useDashboard(page);
  const navigate = useNavigate();

  const { state } = useUsage();
  const remainingRaw = state.remaining;
  const remaining = remainingRaw === 'unlimited' ? Infinity : (typeof remainingRaw === 'number' ? remainingRaw : null);

  // Auto-load dashboard on mount (useDashboard already triggers the fetch with a short delay)
  // Keep a retry handler available for error state
  const handleRetry = () => refetch();

  // Navigation helper for resume-analysis (unused when CTA removed)
  const handleStartOptimization = () => navigate('/resume-analysis');

  if (loading) {
    return (
      <DashboardLayout activeTab="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <div className="text-sm text-muted-foreground">Loading dashboard...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeTab="Dashboard">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Error loading dashboard</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={handleRetry} variant="outline">
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="Dashboard">
      <div className="-mt-4 sm:-mt-6 lg:-mt-8 space-y-4 sm:space-y-6">
        {/* Welcome Section with Start Optimization Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold mb-1">Welcome back!</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Overview of your resume optimization journey
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button onClick={handleStartOptimization} className="shrink-0" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Optimization
            </Button>
            <div className="w-full">
              <SubscriptionBadges />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatCard title="Resumes Analyzed" value={stats?.resumesAnalyzed || 0} icon={FileText} />
          <StatCard
            title="Average ATS Score"
            value={stats?.averageAtsScore !== null ? Math.round(stats.averageAtsScore) : "-"}
            icon={TrendingUp}
          />
          <StatCard title="Optimizations" value={stats?.optimizations || 0} icon={Sparkles} />
        </div>

        {/* Get Started Section - Only show if no resumes analyzed */}
        {stats && stats.resumesAnalyzed === 0 && <GetStartedCard />}

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Activity</h2>
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/documents")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View all resumes
            </Button>
          </div>

          {!stats || stats.recentActivity.length === 0 ? (
            <EmptyActivityCard />
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4">
                {stats.recentActivity.map((activity) => (
                  <RecentActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || loading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Pricing dialog removed from dashboard header — pricing is shown when API calls are attempted */}
    </DashboardLayout>
  );
};

export default Dashboard;
