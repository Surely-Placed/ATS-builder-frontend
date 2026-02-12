import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { AccountStats } from "@/types/profile/overview";

interface AccountInfoCardProps {
  stats: AccountStats | null;
}

// New backend no longer returns accountAge, lastLogin, loginCount
export const AccountInfoCard = ({ stats }: AccountInfoCardProps) => {
  return (
    <Card className="border rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          Account Information
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile and preferences in the Profile and Settings tabs.
        </p>
      </CardContent>
    </Card>
  );
};
