import { useState } from "react";
import { StatsGrid } from "./StatsGrid";
import { RecentAnalyses } from "./RecentAnalyses";
import { AccountInfoCard } from "./AccountInfoCard";
import { SubscriptionCard } from "./SubscriptionCard";
import type { AccountStats, RecentAnalysis, Subscription } from "@/types/profile/overview";

interface OverviewTabProps {
  stats: AccountStats | null;
  recentAnalyses: RecentAnalysis[];
  subscription: Subscription | null;
}

export const OverviewTab = ({ stats, recentAnalyses, subscription }: OverviewTabProps) => {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="space-y-8 pl-0 pr-0">
      {/* Stats Cards Grid */}
      <StatsGrid stats={stats} />

      {/* Content Grid: Recent Analyses (Left) + Account Info & Subscription (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Left Column: Recent Analyses */}
        <RecentAnalyses
          analyses={recentAnalyses}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Right Column: Account Info & Subscription */}
        <div className="space-y-6">
          <AccountInfoCard stats={stats} />
          <SubscriptionCard subscription={subscription} />
        </div>
      </div>
    </div>
  );
};
