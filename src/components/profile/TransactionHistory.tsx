import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { apiClient } from '@/services/resumeApi';

type Transaction = {
  id: string;
  transaction_type: 'subscription' | 'one_time' | 'refund' | string;
  plan?: string | null;
  amount: number;
  currency: string;
  payment_method?: string | null;
  payment_id?: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | string;
  description?: string | null;
  created_at: string;
};

export const TransactionHistory: React.FC<{ limit?: number }> = ({ limit = 50 }) => {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/profile/transactions?limit=${limit}`;
        console.log('[TransactionHistory] fetching', url);
        const res = await fetch(url, { credentials: 'include' });
        console.log('[TransactionHistory] response status', res.status, res.statusText);
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('[TransactionHistory] non-OK response body:', text);
          throw new Error(`Status ${res.status}`);
        }
        const json = await res.json();
        console.log('[TransactionHistory] response json', json);
        const txs = (json.transactions ?? json.data?.transactions) as Transaction[] | undefined;
        console.log('[TransactionHistory] normalized transactions', txs);
        if (mounted) setTransactions(txs || []);
      } catch (e: any) {
        console.error('[TransactionHistory] failed to fetch transactions', e);
        if (mounted) setError(e?.message || 'Failed to load transactions');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [limit]);

  if (loading) return <div>Loading purchases…</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!transactions || transactions.length === 0)
    return (
      <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
        <CardContent className="p-12 text-center">
          <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No purchase history available</p>
        </CardContent>
      </Card>
    );

  const fmtAmount = (amount: number, currency = 'USD') =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);

  return (
    <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(tx.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{tx.transaction_type.replace('_', ' ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{tx.plan || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{fmtAmount(tx.amount ?? 0, tx.currency)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
