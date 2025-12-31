import { Card, CardContent } from "@/components/ui/card";
import { FileText, TrendingUp, Sparkles, Award, Calendar, Clock, LogIn, CreditCard, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AccountStats {
  totalResumes: number;
  totalAnalyses: number;
  totalOptimizations: number;
  averageScore: number;
  accountAge: number;
  lastLogin: string | null;
  loginCount: number;
}

interface RecentAnalysis {
  id: string;
  ats_score_before: number;
  ats_score_after: number | null;
  job_title: string;
  created_at: string;
}

interface Subscription {
  plan: string;
  active: boolean;
  daysRemaining: number | null;
}

interface OverviewTabProps {
  stats: AccountStats | null;
  recentAnalyses: RecentAnalysis[];
  subscription: Subscription | null;
}

export const OverviewTab = ({ stats, recentAnalyses, subscription }: OverviewTabProps) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-8 pl-0 pr-0">
      {/* Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Resumes */}
          <Card className="border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-[10px] bg-[#EFF6FF] flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Total Resumes</div>
              <div className="text-3xl font-bold text-foreground">{stats.totalResumes}</div>
            </CardContent>
          </Card>

          {/* Total Analyses */}
          <Card className="border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-[10px] bg-[#ECFDF5] flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Total Analyses</div>
              <div className="text-3xl font-bold text-foreground">{stats.totalAnalyses}</div>
            </CardContent>
          </Card>

          {/* Optimizations */}
          <Card className="border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Optimizations</div>
              <div className="text-3xl font-bold text-foreground">{stats.totalOptimizations}</div>
            </CardContent>
          </Card>

          {/* Avg Score */}
          <Card className="border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-[10px] bg-[#F3E8FF] flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Avg Score</div>
              <div className="text-3xl font-bold text-foreground">{Math.round(stats.averageScore)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Grid: Recent Analyses (Left) + Account Info & Subscription (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Left Column: Recent Analyses */}
        <Card className="border rounded-xl shadow-sm">
          <CardContent className="p-6">
            {/* Header with Filters */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">Recent Analyses</h3>
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                {["All", "This Week", "This Month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      activeFilter === filter
                        ? "bg-background text-foreground shadow-sm font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyses List */}
            {recentAnalyses.length > 0 ? (
              <div className="space-y-3">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">{analysis.job_title}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(analysis.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {analysis.ats_score_before}
                      </span>
                      {analysis.ats_score_after && (
                        <>
                          <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {analysis.ats_score_after}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No analyses yet</p>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Account Info & Subscription */}
        <div className="space-y-6">
          {/* Account Information Card */}
          <Card className="border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Account Information
              </h3>
              <div className="space-y-0">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground">Member Since:</span>
                  <span className="text-sm font-semibold text-foreground">{stats?.accountAge || 0} days ago</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Login:
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {stats?.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Total Logins:
                  </span>
                  <span className="text-sm font-semibold text-foreground">{stats?.loginCount || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status Card */}
          <Card className="border rounded-xl shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                Subscription Status
              </h3>
              {subscription ? (
                <div className="space-y-0">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Plan:</span>
                    <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold rounded-full border-0">
                      {subscription.plan}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <Badge className={`px-3 py-1 text-xs font-semibold rounded-full border-0 ${
                      subscription.active
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                    }`}>
                      {subscription.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {!subscription.active && (
                    <Button className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-sm font-semibold">
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-0">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Plan:</span>
                    <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 text-xs font-semibold rounded-full border-0">
                      Free
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    <Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 text-xs font-semibold rounded-full border-0">
                      Inactive
                    </Badge>
                  </div>
                  <Button className="w-full mt-5 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-sm font-semibold">
                    Upgrade Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
