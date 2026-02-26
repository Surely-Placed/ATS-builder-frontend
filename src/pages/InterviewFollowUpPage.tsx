import React, { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/context/AuthContext";
import type { FollowUpQA } from "@/features/interviewPacket";

// Frontend helper to fetch persisted follow-ups (no UI)
function getAuthToken(): string | null {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("access_token")
    : null;
}

/** Backend returns ResponseHelper.success(res, result) → body.data.data.followups (Axios: res.data.data.followups) */
function getFollowupsFromResponse(json: unknown): FollowUpQA[] {
  const data = (json as any)?.data;
  const list = data?.data?.followups ?? data?.followups;
  return Array.isArray(list) ? (list as FollowUpQA[]) : [];
}

/**
 * Fetch persisted follow-ups for a packet.
 * GET /api/interview-packet/:id/follow-ups?round_index=1..4 for one round, or without query for all.
 */
async function fetchPacketFollowups(
  packetId: string,
  roundIndex?: number
): Promise<FollowUpQA[]> {
  const token = getAuthToken();
  const url =
    typeof roundIndex === "number" && Number.isInteger(roundIndex)
      ? `${API_BASE_URL}/interview-packet/${packetId}/follow-ups?round_index=${roundIndex}`
      : `${API_BASE_URL}/interview-packet/${packetId}/follow-ups`;

  const res = await fetch(url, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (json as any)?.message ||
        (json as any)?.error ||
        "Failed to load follow-ups"
    );
  }
  return getFollowupsFromResponse(json);
}

export default function InterviewFollowUpPage() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = new URLSearchParams(loc.search);
  const packetId = query.get("packet_id");
  const roundIndexParam = query.get("round_index");
  const roundIndex = roundIndexParam ? Number(roundIndexParam) : undefined;

  const [followups, setFollowups] = useState<FollowUpQA[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayName = useMemo(() => {
    const raw =
      user?.displayName ||
      (user?.email ? user.email.split("@")[0] : "") ||
      "JobRabbit user";
    return raw
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, [user]);

  const baseGreeting = useMemo(() => {
    const hour = new Date().getHours();
    const prefix =
      hour >= 18 ? "Good evening" : hour >= 12 ? "Good afternoon" : "Good morning";
    return `${prefix}, ${displayName}`;
  }, [displayName]);

  const [typedGreeting, setTypedGreeting] = useState("");

  useEffect(() => {
    setTypedGreeting("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTypedGreeting((prev) =>
        i <= baseGreeting.length ? baseGreeting.slice(0, i) : prev
      );
      if (i >= baseGreeting.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [baseGreeting]);

  // Hydrate from navigation state if provided (e.g. coming from packet detail)
  useEffect(() => {
    const state = loc.state as { existingFollowups?: FollowUpQA[] } | null;
    const existing = state?.existingFollowups ?? [];
    if (existing.length) {
      setFollowups(existing);
      setLoading(false);
    }
  }, [loc.state]);

  // Fetch persisted follow-ups from backend
  useEffect(() => {
    if (!packetId || roundIndex === undefined) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const existing = await fetchPacketFollowups(packetId, roundIndex);
        if (!cancelled) {
          setFollowups(existing);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Unable to load follow-ups for this section."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [packetId, roundIndex]);

  return (
    <DashboardLayout activeTab="Interview Packets">
      <div className="relative flex min-h-[70vh] flex-col py-10">
        <div className="absolute left-4 top-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to packet
          </Button>
        </div>

        <div className="flex flex-1 items-center">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Logo size="lg" className="scale-150 sm:scale-[1.8]" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-accent-hover">
                  {typedGreeting || baseGreeting}
                </p>
                {roundIndex !== undefined && (
                  <p className="text-sm text-muted-foreground">
                    Follow-ups · Section {roundIndex}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 sm:p-6 space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading follow-up questions and answers for this section…
                </p>
              ) : error ? (
                <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
              ) : followups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No follow-ups have been generated for this section yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {followups.map((f, idx) => (
                    <div
                      key={`${f.parent_question_text}-${f.question_text}-${idx}`}
                      className="rounded-xl border border-[#E3D5CA] bg-[#FFFAF4] p-4 sm:p-5 space-y-2 text-left"
                    >
                      {f.parent_question_text && (
                        <p className="text-xs font-medium text-[#936639]">
                          You asked:{" "}
                          <span className="font-normal text-[#582F0E]">
                            {f.parent_question_text}
                          </span>
                        </p>
                      )}
                      {f.question_text && (
                        <p className="text-sm font-semibold text-[#582F0E]">
                          Follow-up: {f.question_text}
                        </p>
                      )}
                      {f.answer_text && (
                        <p className="text-sm text-[#3F2A1C] whitespace-pre-wrap leading-relaxed">
                          {f.answer_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
