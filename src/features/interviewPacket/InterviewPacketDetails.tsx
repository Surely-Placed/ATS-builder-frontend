import React from "react";
import type { InterviewPacket, Round, BehavioralQuestion, Difficulty, FollowUpQA } from "./types";

export interface InterviewPacketDetailsProps {
  packet: InterviewPacket;
}

/**
 * Renders ONE interview packet as: Question → Answer, Question → Answer (max 2 per round).
 * Uses shared types; coding questions can include answer_text (approach); behavioral has Get more follow-ups.
 */
export function InterviewPacketDetails({ packet }: InterviewPacketDetailsProps) {
  if (!packet) return null;

  const formatRoundType = (roundType: string) => {
    if (roundType === "system_design") return "System Design";
    return roundType.charAt(0).toUpperCase() + roundType.slice(1);
  };

   const difficultyBadgeClasses = (difficulty?: Difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200";
      case "hard":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {packet.job_title} {packet.company_name ? `@ ${packet.company_name}` : ""}
        </h1>
        <p className="text-sm text-gray-500">
          Generated on {new Date(packet.created_at).toLocaleString()}
        </p>
      </div>

      {/* Rounds → each as Q/A pairs */}
      {packet.content.rounds.map((round) => (
        <div
          key={round.round_index}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Round {round.round_index}: {round.round_name}
                </h2>
                <p className="text-xs uppercase tracking-wide text-purple-500 dark:text-purple-400">
                  {formatRoundType(round.round_type)}
                </p>
              </div>
              {round.practice_links && round.practice_links.length > 0 && (
                <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-purple-500 dark:text-purple-400">
                    Practice:
                  </span>
                  <ul className="flex flex-col gap-2 mt-1">
                    {round.practice_links.slice(0, 3).map((pl, i) => {
                      const isLeetCode = pl.url.toLowerCase().includes("leetcode.com");
                      return (
                        <li key={i}>
                          <div className="inline-flex items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-xs sm:text-sm font-medium text-purple-700 shadow-sm dark:bg-purple-950/40 dark:text-purple-200">
                            {isLeetCode && (
                              <img
                                src="/leetcode.png"
                                alt="LeetCode"
                                className="h-5 w-5 rounded-full object-contain"
                              />
                            )}
                            <span className="text-[11px] sm:text-xs text-purple-600 dark:text-purple-300">
                              Q{i + 1}.
                            </span>
                            <a
                              href={pl.url}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate underline decoration-purple-300 hover:decoration-purple-500"
                            >
                              {pl.title || pl.url}
                            </a>
                            {pl.difficulty && (
                              <span
                                className={
                                  "ml-1 inline-flex items-center rounded-full px-2 py-[1px] text-[11px] font-semibold " +
                                  difficultyBadgeClasses(pl.difficulty)
                                }
                              >
                                {pl.difficulty}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Coding Q&A (max 2, normalized in backend) */}
            {round.coding_questions && round.coding_questions.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Coding (Question → Answer)
                </div>
                {round.coding_questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-800/50"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      Q{idx + 1}. {q.question_text}{" "}
                      {q.difficulty && (
                        <span className="ml-1 inline-flex items-center rounded-full bg-gray-200 px-2 py-[1px] text-[11px] text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    {q.answer_text && (
                      <div className="mt-1 rounded-lg border border-gray-100 bg-white px-2 py-1 text-sm text-gray-700 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                        <span className="font-semibold">Answer (approach): </span>
                        <span className="font-normal">{q.answer_text}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Behavioral & System Design Q&A (max 2) — each has inline follow-ups */}
            {round.behavioral_questions && round.behavioral_questions.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {round.round_type === "system_design"
                    ? "System Design Questions (Question → Answer)"
                    : "Behavioral (Question → Answer)"}
                </div>

                {round.behavioral_questions.map((q, idx) => {
                  const followups: FollowUpQA[] =
                    // Prefer question-level follow-ups generated with the packet
                    (q as BehavioralQuestion & { followups?: FollowUpQA[] }).followups ||
                    // Fallback to round-level follow-ups for older packets
                    round.followups ||
                    [];

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-purple-100 bg-purple-50 px-3 py-2 text-sm dark:border-purple-800/50 dark:bg-purple-950/30"
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          Q{idx + 1}. {q.question_text}
                        </div>
                        {q.category && round.round_type !== "system_design" && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            Category: <span className="font-medium">{q.category}</span>
                          </div>
                        )}
                        {q.leadership_principles && q.leadership_principles.length > 0 && (
                          <div className="text-[11px] text-gray-600 dark:text-gray-400">
                            LPs:{" "}
                            <span className="font-medium">
                              {q.leadership_principles.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {q.answer_text && (
                        <div className="mt-2 rounded-lg border border-purple-100 bg-white px-2 py-1 text-sm text-gray-800 whitespace-pre-wrap dark:border-purple-800 dark:bg-gray-900 dark:text-gray-200">
                          <span className="font-semibold">Answer: </span>
                          <span className="font-normal">{q.answer_text}</span>
                        </div>
                      )}

                      {/* Inline follow-ups loaded with the packet */}
                      {followups.length > 0 ? (
                        <div className="mt-3 space-y-1.5">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
                            Follow-ups ({followups.length})
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {followups.map((f, fIdx) => (
                              <div
                                key={`${f.question_text}-${fIdx}`}
                                className="rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs dark:border-amber-800 dark:bg-amber-950/30"
                              >
                                {f.parent_question_text && (
                                  <p className="mb-0.5 text-[11px] text-gray-600 dark:text-gray-400">
                                    You asked:{" "}
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                      {f.parent_question_text}
                                    </span>
                                  </p>
                                )}
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  Follow-up {fIdx + 1}: {f.question_text}
                                </p>
                                <p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                  {f.answer_text}
                                </p>
                                {f.leadership_principles && f.leadership_principles.length > 0 && (
                                  <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-400">
                                    LPs: {f.leadership_principles.join(", ")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-[11px] italic text-purple-800/80 dark:text-purple-200/80">
                          No follow-ups available for this question.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
