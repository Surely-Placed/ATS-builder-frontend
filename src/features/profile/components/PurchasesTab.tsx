import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

interface Transaction {
  id: string;
  transaction_type: string;
  plan: string | null;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface PurchasesTabProps {
  transactions?: Transaction[];
}

import TransactionHistory from '@/features/profile/components/TransactionHistory';

export const PurchasesTab = ({ transactions }: PurchasesTabProps) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };

    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 pl-0 pr-0">
      {transactions && transactions.length > 0 ? (
        <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                        {tx.transaction_type.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                        {tx.plan || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {
                          (() => {
                            const raw = tx.amount as any;
                            const num = typeof raw === 'number' ? raw : parseFloat(String(raw));
                            if (Number.isFinite(num)) {
                              return <>${num.toFixed(2)} {tx.currency}</>;
                            }
                            // fallback to rendering the raw value
                            return <>{String(raw)} {tx.currency}</>;
                          })()
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(tx.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // If parent didn't pass transactions, let TransactionHistory fetch them
        transactions === undefined ? (
          <TransactionHistory />
        ) : (
          <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-12 text-center">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No purchase history available</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};
