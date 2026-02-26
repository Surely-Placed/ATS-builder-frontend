import { FileText, TrendingUp, Sparkles, Award } from "lucide-react";
import { StatCard } from "./StatCard";
import type { AccountStats } from "@/types/profile/overview";

interface StatsGridProps {
  stats: AccountStats | null;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        icon={FileText}
        label="Total Resumes"
        value={stats.totalResumes}
        iconBgColor="bg-[#EFF6FF]"
        iconColor="text-[#3B82F6]"
      />
      <StatCard
        icon={TrendingUp}
        label="Total Analyses"
        value={stats.totalAnalyses}
        iconBgColor="bg-[#ECFDF5]"
        iconColor="text-[#10B981]"
      />
      <StatCard
        icon={Sparkles}
        label="ATS  Analyses"
        value={stats.totalAnalyses ?? 0}
        iconBgColor="bg-[#FEF3C7]"
        iconColor="text-[#F59E0B]"
      />
      <StatCard
        icon={Award}
        label="Avg Score"
        value={Math.round(stats.averageScore)}
        iconBgColor="bg-[#F3E8FF]"
        iconColor="text-[#8B5CF6]"
      />
    </div>
  );
};
