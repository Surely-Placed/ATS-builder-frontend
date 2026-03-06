import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { GetStartedCard } from "@/features/dashboard/components/GetStartedCard";
import { EmptyActivityCard } from "@/features/dashboard/components/EmptyActivityCard";
import { RecentActivityCard } from "@/features/dashboard/components/RecentActivityCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { Sparkles, Loader2, AlertCircle, Search } from "lucide-react";
import { useUsage } from '@/context/UsageContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import SubscriptionBadges from '@/features/dashboard/components/SubscriptionBadges';
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "@/components/ui/date-range-filter";

const Dashboard = () => {
  const { stats, recentList, Meta, loadingList, loading, error, refetch, fetchPage, setDateFilter } = useDashboard();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const fromTime = dateRange?.from
      ? dateRange.from.setHours(0, 0, 0, 0)
      : undefined;
    const toTime = dateRange?.to
      ? dateRange.to.setHours(23, 59, 59, 999)
      : dateRange?.from
      ? dateRange.from.setHours(23, 59, 59, 999)
      : undefined;

    return recentList.filter((a) => {
      if (q && !a.jobTitle.toLowerCase().includes(q)) return false;
      if (fromTime !== undefined || toTime !== undefined) {
        const t = a.createdAt ? new Date(a.createdAt).getTime() : NaN;
        if (!Number.isFinite(t)) return false;
        if (fromTime !== undefined && t < fromTime) return false;
        if (toTime !== undefined && t > toTime) return false;
      }
      return true;
    });
  }, [recentList, searchQuery, dateRange]);


  const { state } = useUsage();
  const remainingRaw = state.remaining;
  const remaining = remainingRaw === 'unlimited' ? Infinity : (typeof remainingRaw === 'number' ? remainingRaw : null);



  // Sync backend date filter whenever the user changes the date range
  useEffect(() => {
    if (dateRange?.from) {
      const isoDate = dateRange.from.toISOString().slice(0, 10); // YYYY-MM-DD
      setDateFilter(isoDate);
      fetchPage(1);
    } else {
      setDateFilter(null);
      fetchPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

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
          <div className="flex flex-row items-center gap-2 flex-wrap justify-end">
            {/* Overall applications badge (styled to match premium badge) */}
            <div className="inline-flex h-9 items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-1.5 box-border">
              <span className="text-xs text-muted-foreground">Total applications</span>
              <span className="text-sm font-semibold text-foreground">
                {Meta?.total ?? recentList.length}
              </span>
            </div>
            <SubscriptionBadges />
            <Button onClick={handleStartOptimization} className="shrink-0" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Optimization
            </Button>
          </div>
        </div>

        {/* Get Started Section - Only show if no  analyses yet */}
        {stats && (stats.AnalysesCount ?? 0) === 0 && !loadingList && recentList.length === 0 && <GetStartedCard />}

        {/* Search bar + pagination (pagination in corner) + list */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="relative flex-1 min-w-0 sm:max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by job title..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DateRangeFilter
              label="Date"
              value={dateRange}
              onChange={setDateRange}
              count={dateRange?.from && Meta ? Meta.total : undefined}
            />
            {Meta && (
              <div className="flex items-center gap-2 flex-shrink-0 sm:ml-auto">
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  Page {Meta.page} of {Meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={Meta.page <= 1 || loadingList}
                    onClick={() => fetchPage(Meta.page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={Meta.page >= Meta.totalPages || loadingList}
                    onClick={() => fetchPage(Meta.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>

          {loadingList && !recentList.length ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !recentList.length ? (
            <EmptyActivityCard />
          ) : filteredList.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No analyses match your search.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredList.map((activity) => (
                <RecentActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Pricing dialog removed from dashboard header — pricing is shown when API calls are attempted */}
    </DashboardLayout>
  );
};

export default Dashboard;
