import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const EmptyActivityCard = () => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-muted rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">No recent activity</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-md px-4">
            Start analyzing your resume to see your optimization history and track your progress
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
