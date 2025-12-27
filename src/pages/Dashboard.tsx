import DashboardLayout from "@/components/layouts/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { GetStartedCard } from "@/components/dashboard/GetStartedCard";
import { EmptyActivityCard } from "@/components/dashboard/EmptyActivityCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { useDashboard } from "@/hooks/useDashboard";
import { FileText, TrendingUp, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { stats, loading, error, refetch } = useDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <DashboardLayout activeTab="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
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
                <Button onClick={refetch} variant="outline">
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
          <div className="space-y-4 sm:space-y-6">
            {/* Welcome Section with Start Optimization Button */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold mb-1">Welcome back!</h1>
                <p className="text-muted-foreground text-xs sm:text-sm">Overview of your resume optimization journey</p>
              </div>
              <Button 
                onClick={() => navigate("/resume-optimization")}
                className="shrink-0"
                size="sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Optimization
              </Button>
            </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <StatCard 
            title="Resumes Analyzed" 
            value={stats?.resumesAnalyzed || 0} 
            icon={FileText} 
          />
          <StatCard 
            title="Average ATS Score" 
            value={stats?.averageAtsScore !== null ? Math.round(stats.averageAtsScore) : '-'} 
            icon={TrendingUp} 
          />
          <StatCard 
            title="Optimizations" 
            value={stats?.optimizations || 0} 
            icon={Sparkles} 
          />
        </div>

        {/* Get Started Section - Only show if no resumes analyzed */}
        {stats && stats.resumesAnalyzed === 0 && <GetStartedCard />}

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Activity</h2>
          
          {!stats || stats.recentActivity.length === 0 ? (
            <EmptyActivityCard />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {stats.recentActivity.map((activity) => (
                <RecentActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
