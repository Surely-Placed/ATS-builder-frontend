import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Calendar,
  Clock,
} from "lucide-react";
import type { ApiKey } from "@/features/profile/apiKeysService";

interface ApiKeyCardProps {
  apiKey: ApiKey;
  actionLoading: string | null;
  onOpenReleaseDialog: (keyId: string) => void;
  onOpenRevokeDialog: (keyId: string) => void;
  formatDate: (dateString: string | null) => string;
}

export const ApiKeyCard = ({
  apiKey,
  actionLoading,
  onOpenReleaseDialog,
  onOpenRevokeDialog,
  formatDate,
}: ApiKeyCardProps) => {
  return (
    <Card className="border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{apiKey.name}</h3>
              {apiKey.is_active ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Revoked
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              {apiKey.device_id ? (
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>
                    <strong className="text-foreground">Device:</strong>{" "}
                    {apiKey.device_name || "Unknown Device"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Monitor className="h-4 w-4" />
                  <span>Not assigned to any device</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  <strong className="text-foreground">Created:</strong>{" "}
                  {formatDate(apiKey.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  <strong className="text-foreground">Last used:</strong>{" "}
                  {formatDate(apiKey.last_used_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {apiKey.is_active && apiKey.device_id && (
              <Button
                onClick={() => onOpenReleaseDialog(apiKey.id)}
                disabled={actionLoading === apiKey.id}
                variant="outline"
                size="sm"
                title="Release from device to use on another device"
              >
                {actionLoading === apiKey.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Release Device
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={() => onOpenRevokeDialog(apiKey.id)}
              disabled={actionLoading === apiKey.id || !apiKey.is_active}
              variant="destructive"
              size="sm"
            >
              {actionLoading === apiKey.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Revoke
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
