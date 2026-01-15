import React, { useEffect, useState, useRef } from 'react';

type RecentItem = {
  id: string;
  resumeId: string;
  jobTitle: string;
  atsScoreBefore?: number | null;
  atsScoreAfter?: number | null;
  scoreImprovement?: number | null;
  status: string;
  createdAt: string;
};

type DashboardStats = {
  totalResumes: number;
  avgAtsScore: number | null;
  optimizationsCompleted: number;
  recentActivity: {
    items: RecentItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
};

export default function DashboardPanel() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const etagRef = useRef<string | null>(null);
  const pollRef = useRef<number | null>(null);

  async function fetchStats() {
    setError(null);
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (etagRef.current) headers['If-None-Match'] = etagRef.current;

      const res = await fetch('/api/dashboard/stats', {
        method: 'GET',
        credentials: 'include',
        headers,
      });

      if (res.status === 304) {
        // Not modified; keep existing data
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Status ${res.status}: ${body}`);
      }

      const etag = res.headers.get('ETag');
      if (etag) etagRef.current = etag;

      const payload = await res.json();
      if (!payload?.success || !payload.data) {
        throw new Error('Malformed response');
      }

      setStats(payload.data as DashboardStats);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    fetchStats();

    // poll every 30s (matches server Cache-Control)
    pollRef.current = window.setInterval(fetchStats, 30_000);

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  if (loading && !stats) {
    return <div>Loading dashboard…</div>;
  }

  if (error && !stats) {
    return <div>Error loading dashboard: {error}</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        <div style={{ minWidth: 160 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Resumes</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {stats?.totalResumes ?? '—'}
          </div>
        </div>

        <div style={{ minWidth: 160 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Average ATS</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {stats?.avgAtsScore !== null ? stats.avgAtsScore.toFixed(1) : '—'}
          </div>
        </div>

        <div style={{ minWidth: 160 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Optimizations</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {stats?.optimizationsCompleted ?? '—'}
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: 8 }}>Recent Activity</h3>
      <div style={{ marginTop: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '8px 4px' }}>When</th>
              <th style={{ padding: '8px 4px' }}>Job</th>
              <th style={{ padding: '8px 4px' }}>Before</th>
              <th style={{ padding: '8px 4px' }}>After</th>
              <th style={{ padding: '8px 4px' }}>Change</th>
              <th style={{ padding: '8px 4px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentActivity.items || []).map((r) => {
              const before = Number(r.atsScoreBefore ?? 0);
              const after = r.atsScoreAfter != null ? Number(r.atsScoreAfter) : null;
              const change =
                after != null && !Number.isNaN(before) ? (after - before) : null;
              const when = new Date(r.createdAt);
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: '8px 4px', verticalAlign: 'top', width: 160 }}>
                    {when ? new Date(when).toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>
                    {r.jobTitle || 'Untitled'}
                  </td>
                  <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{before}</td>
                  <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>
                    {after !== null ? after : '—'}
                  </td>
                  <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>
                    {change !== null ? (
                      <span style={{ color: change > 0 ? 'green' : change < 0 ? 'crimson' : '#666' }}>
                        {change > 0 ? '+' : ''}{change}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{r.status}</td>
                </tr>
              );
            })}
            {(!stats || stats.recentActivity.items.length === 0) && (
              <tr>
                <td colSpan={6} style={{ padding: 12, color: '#666' }}>
                  No recent activity
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
        <span>Last update: </span>
        <span>{etagRef.current ?? 'none'}</span>
        <span> · Polling every 30s</span>
      </div>
    </div>
  );
}