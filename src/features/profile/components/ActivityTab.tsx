import { Card, CardContent } from "@/components/ui/card";
import { Activity as ActivityIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  activity_type: string;
  entity_type: string | null;
  description: string | null;
  created_at: string;
}

interface ActivityTabProps {
  activities: Activity[];
}

export const ActivityTab = ({ activities }: ActivityTabProps) => {
  return (
    <div className="space-y-6 pl-0 pr-0">
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ActivityIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">
                        {activity.activity_type.replace("_", " ")}
                      </span>
                      {activity.entity_type && (
                        <Badge variant="outline" className="text-xs">
                          {activity.entity_type}
                        </Badge>
                      )}
                    </div>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardContent className="p-12 text-center">
            <ActivityIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activity history available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
