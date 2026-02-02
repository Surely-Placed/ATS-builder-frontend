import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, LogIn } from "lucide-react";
import type { AccountStats } from "@/types/profile/overview";

interface AccountInfoCardProps {
  stats: AccountStats | null;
}

export const AccountInfoCard = ({ stats }: AccountInfoCardProps) => {
  return (
    <Card className="border rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          Account Information
        </h3>
        <div className="space-y-0">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Member Since:</span>
            <span className="text-sm font-semibold text-foreground">
              {stats?.accountAge || 0} days ago
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Login:
            </span>
            <span className="text-sm font-semibold text-foreground">
              {stats?.lastLogin ? new Date(stats.lastLogin).toLocaleDateString() : "Never"}
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
  );
};
