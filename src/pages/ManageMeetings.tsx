import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { API_BASE_URL } from "@/config/api";
import { Loader2, Link as LinkIcon, CalendarDays, AlertCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "@/components/ui/date-range-filter";

export type MeetingStatus = "locked" | "confirmed" | "completed" | "expired" | "cancelled";

export interface Meeting {
  id: string;
  user_id: string | null;
  meeting_url: string;
  meeting_status: MeetingStatus;
  meeting_start_time: string;
  meeting_end_time: string;
  invitee_email: string | null;
  invitee_name: string | null;
  invitee_mobile: string | null;
  invitee_resume_url: string | null;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetMeetingsResponse {
  meetings: Meeting[];
  count: number;
}

async function fetchMeetings(limit: number = 20): Promise<GetMeetingsResponse> {
  const url = `${API_BASE_URL}/meetings?limit=${limit}`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch meetings: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { data: GetMeetingsResponse };
  return data.data;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Join window logic:
// - Window starts exactly at meeting_start_time
// - Window ends 30 minutes after start (fixed duration)
function getJoinWindow(meeting: Meeting) {
  const start = new Date(meeting.meeting_start_time);
  if (Number.isNaN(start.getTime())) return { start: null as Date | null, end: null as Date | null };
  const end = new Date(start.getTime() + 30 * 60 * 1000); // +30 minutes
  return { start, end };
}

function isMeetingExpired(meeting: Meeting): boolean {
  const { end } = getJoinWindow(meeting);
  if (!end) return false;
  const now = new Date();
  return now.getTime() > end.getTime();
}

function isWithinJoinWindow(meeting: Meeting): boolean {
  const { start, end } = getJoinWindow(meeting);
  if (!start || !end) return false;
  const now = new Date();
  const nowMs = now.getTime();
  return nowMs >= start.getTime() && nowMs <= end.getTime();
}

function formatTimeRange(meeting: Meeting) {
  const { start, end } = getJoinWindow(meeting);
  if (!start || !end) return "";
  const from = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const to = end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const tz =
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    undefined;
  return tz ? `${from} – ${to} (${tz})` : `${from} – ${to}`;
}

const PAGE_SIZE = 20;

const ManageMeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchMeetings(200)
      .then((res) => {
        if (!cancelled) {
          setMeetings(res.meetings);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load meetings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredMeetings = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) return meetings;
    const fromTime = dateRange.from ? dateRange.from.setHours(0, 0, 0, 0) : undefined;
    const toTime =
      dateRange.to
        ? dateRange.to.setHours(23, 59, 59, 999)
        : dateRange.from
        ? dateRange.from.setHours(23, 59, 59, 999)
        : undefined;

    return meetings.filter((m) => {
      const t = new Date(m.meeting_start_time).getTime();
      if (!Number.isFinite(t)) return false;
      if (fromTime !== undefined && t < fromTime) return false;
      if (toTime !== undefined && t > toTime) return false;
      return true;
    });
  }, [meetings, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredMeetings.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageSliceStart = (safePage - 1) * PAGE_SIZE;
  const pageSliceEnd = pageSliceStart + PAGE_SIZE;
  const pageMeetings = filteredMeetings.slice(pageSliceStart, pageSliceEnd);

  return (
    <DashboardLayout activeTab="Manage Meetings">
      <div className="space-y-6">
        {/* Header + filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
              <CalendarDays className="h-5 w-5 text-primary" />
              Manage meetings
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              View your upcoming and past resume justification sessions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DateRangeFilter
              label="Date"
              value={dateRange}
              onChange={setDateRange}
              count={dateRange?.from || dateRange?.to ? filteredMeetings.length : undefined}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground mb-1">No meetings yet</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Once you book a resume justification session, it will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/60">
                  <tr className="text-left">
                    <th className="px-4 py-2 font-medium text-muted-foreground">Date & time</th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">Invitee</th>
                    <th className="px-4 py-2 font-medium text-muted-foreground">Meet link</th>
                  </tr>
                </thead>
                <tbody>
                  {pageMeetings.map((m) => (
                    <tr key={m.id} className="border-t border-border/60">
                      <td className="px-4 py-2 align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            {formatDate(m.meeting_start_time)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeRange(m)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <span
                          className={
                            isMeetingExpired(m) || m.meeting_status === "expired"
                              ? "inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700"
                              : "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 capitalize"
                          }
                        >
                          {isMeetingExpired(m) || m.meeting_status === "expired"
                            ? "Expired"
                            : m.meeting_status}
                        </span>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{m.invitee_name || "—"}</span>
                          <span className="text-xs text-muted-foreground">{m.invitee_email || ""}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top">
                        {isMeetingExpired(m) || m.meeting_status === "expired" || !m.meeting_url ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                            Expired
                          </span>
                        ) : !isWithinJoinWindow(m) ? (
                          <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                            Upcoming
                          </span>
                        ) : (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1 border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          >
                            <a href={m.meeting_url} target="_blank" rel="noreferrer">
                              <Video className="h-4 w-4" />
                              Join
                            </a>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-end gap-3">
                <span className="text-sm text-muted-foreground">
                  Page {safePage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageMeetingsPage;

