import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyRound } from "lucide-react";
import type { ApiKey } from "@/features/profile/apiKeysService";
import { ApiKeyCard } from "./ApiKeyCard";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  loading: boolean;
  actionLoading: string | null;
  onOpenReleaseDialog: (keyId: string) => void;
  onOpenRevokeDialog: (keyId: string) => void;
  formatDate: (dateString: string | null) => string;
}

export const ApiKeyList = ({
  apiKeys,
  loading,
  actionLoading,
  onOpenReleaseDialog,
  onOpenRevokeDialog,
  formatDate,
}: ApiKeyListProps) => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Your API Keys</CardTitle>
        <CardDescription>
          {loading
            ? "Loading..."
            : `${apiKeys.length} ${apiKeys.length === 1 ? "key" : "keys"} total`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3 p-4 border rounded-lg">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-12">
            <KeyRound className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No API keys yet. Generate one above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <ApiKeyCard
                key={key.id}
                apiKey={key}
                actionLoading={actionLoading}
                onOpenReleaseDialog={onOpenReleaseDialog}
                onOpenRevokeDialog={onOpenRevokeDialog}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
