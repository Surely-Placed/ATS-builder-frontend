import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import type { FollowUpQA } from "./types";

function getFollowupsFromResponse(json: unknown): FollowUpQA[] {
  const data = (json as any)?.data;
  const list = data?.data?.followups ?? data?.followups;
  return Array.isArray(list) ? (list as FollowUpQA[]) : [];
}

export interface FollowupsForQuestionProps {
  packetId: string;
  roundIndex: number; // 1–4
  questionText: string; // the main question text for this card
}

/** Displays follow-ups for one question; loaded from API (generated with packet, no generate button). */
export function FollowupsForQuestion({
  packetId,
  roundIndex,
  questionText,
}: FollowupsForQuestionProps) {
  const [followups, setFollowups] = useState<FollowUpQA[]>([]);
  const [error, setError] = useState<string | null>(null);

  const trimmedQuestion = questionText.trim();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/interview-packet/${packetId}/follow-ups?round_index=${roundIndex}`,
          { credentials: "include" }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as any)?.message || `Failed to load follow-ups (${res.status})`
          );
        }
        const body = await res.json().catch(() => ({}));
        const all = getFollowupsFromResponse(body);
        if (!cancelled) {
          setFollowups(
            all.filter(
              (f) => (f.parent_question_text || "").trim() === trimmedQuestion
            )
          );
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load follow-ups");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [packetId, roundIndex, trimmedQuestion]);

  return (
    <div className="mt-3 space-y-3">
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}

      {followups.length > 0 && (
        <div className="flex flex-col gap-2">
          {followups.map((f, idx) => (
            <div
              key={`${f.question_text}-${idx}`}
              className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm dark:border-amber-800 dark:bg-amber-950/30"
            >
              {f.parent_question_text && (
                <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                  You asked:{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {f.parent_question_text}
                  </span>
                </p>
              )}
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Follow-up {idx + 1}: {f.question_text}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {f.answer_text}
              </p>
              {f.leadership_principles && f.leadership_principles.length > 0 && (
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  LPs: {f.leadership_principles.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
