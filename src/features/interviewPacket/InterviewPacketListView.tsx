import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import type { InterviewPacket } from "./types";
import { DateRange } from "react-day-picker";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import { cn } from "@/lib/utils";

/**
 * View-only list of generated interview packets (for dashboard nav).
 * Styling matches main Dashboard: simple black/white UI.
 * Packet detail view (InterviewPacketDetails) keeps its own colors.
 */
const PACKETS_PAGE_LIMIT = 20;

export function InterviewPacketListView() {
  const navigate = useNavigate();
  const [packets, setPackets] = useState<InterviewPacket[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  async function fetchPackets() {
    const url = `${API_BASE_URL}/interview-packet?page=${page}&limit=${PACKETS_PAGE_LIMIT}`;
    setLoadingList(true);
    setError(null);
    try {
      const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error((json?.message || json?.error) || "Failed to fetch interview packets");
      }
      const rawList: InterviewPacket[] =
        json?.data?.items ?? json?.data ?? (Array.isArray(json?.data?.data) ? json.data.data : []);
      const total =
        json?.data?.meta?.total ?? json?.data?.total ?? rawList.length;
      const pages =
        json?.data?.meta?.totalPages ??
        json?.data?.totalPages ??
        Math.max(1, Math.ceil(total / PACKETS_PAGE_LIMIT));

      setPackets(rawList);
      setTotalPages(pages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load packets");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    fetchPackets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredPackets = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) return packets;
    const fromTime = dateRange.from ? dateRange.from.setHours(0, 0, 0, 0) : undefined;
    const toTime = dateRange.to
      ? dateRange.to.setHours(23, 59, 59, 999)
      : dateRange.from
      ? dateRange.from.setHours(23, 59, 59, 999)
      : undefined;

    return packets.filter((p) => {
      const t = new Date(p.created_at).getTime();
      if (fromTime !== undefined && t < fromTime) return false;
      if (toTime !== undefined && t > toTime) return false;
      return true;
    });
  }, [packets, dateRange]);

  return (
    <div className="min-h-[60vh] space-y-4 sm:space-y-6 pb-8">
      {/* Header — same layout as main Dashboard: title + controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">Your Interview Packets</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Practice rounds, questions & answers tailored to your dream role.
          </p>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 justify-end">
          <DateRangeFilter
            label="Date"
            value={dateRange}
            onChange={setDateRange}
            count={dateRange?.from || dateRange?.to ? filteredPackets.length : undefined}
            countLabel="Total Packets"
          />
          <Pagination className="mx-0 w-auto">
            <PaginationContent className="flex-wrap gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={cn(
                    (page <= 1 || loadingList) && "pointer-events-none opacity-50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1 && !loadingList) setPage((p) => p - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-2 text-xs text-muted-foreground sm:text-sm">
                  Page {page} of {totalPages}
                  <span className="ml-0.5">· 20/page</span>
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={cn(
                    (page >= totalPages || loadingList) && "pointer-events-none opacity-50"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages && !loadingList) setPage((p) => p + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Button onClick={() => navigate("/interview-packet/buy")} size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Generate new packet
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Packet list */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
          <h2 className="text-lg font-semibold">Choose a packet to open</h2>
        </div>

        {loadingList ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your packets…</p>
          </div>
        ) : filteredPackets.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
            <Sparkles className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
            <p className="mb-1 font-medium">No packets yet</p>
            <p className="mb-4 text-sm text-muted-foreground">Generate your first one and start practicing.</p>
            <Button onClick={() => navigate("/interview-packet/buy")} variant="outline">
              Create your first packet
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredPackets.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/interview-packet/${p.id}`)}
                className="cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{p.job_title}</div>
                    <div className="text-sm text-muted-foreground">
                      {p.company_name || "—"} · {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </section>

      {/* Separate detail screen now handles rounds; keep this page list-only */}
    </div>
  );
}
