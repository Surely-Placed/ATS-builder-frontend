export type Difficulty = "easy" | "medium" | "hard";

export interface PracticeLink {
  url: string;
  title?: string;
  difficulty?: Difficulty;
  topic?: string;
}

export interface BehavioralQuestion {
  question_text: string;
  category?: string;
  answer_text?: string;
  leadership_principles?: string[];
  /** Optional follow-ups generated with the packet (new shape). */
  followups?: FollowUpQA[];
}

export interface FollowUpQA {
  question_text: string;
  answer_text: string;
  /** Parent question this follow-up is for (from API; no extra request needed) */
  parent_question_text?: string;
  leadership_principles?: string[];
}

export interface CodingQuestion {
  question_text: string;
  difficulty?: Difficulty;
  topic?: string;
  answer_text?: string; // brief solution/approach
  /** Optional follow-ups generated with the packet (new shape, for coding/system rounds). */
  followups?: FollowUpQA[];
}

export interface Round {
  round_index: number;
  round_name: string;
  round_type: string;
  coding_questions?: CodingQuestion[];
  behavioral_questions?: BehavioralQuestion[];
  followups?: FollowUpQA[];
  practice_links?: PracticeLink[];
}

export interface CandidateSnapshot {
  summary?: string | null;
  skills?: string[] | null;
  years_of_experience?: number | null;
}

export interface InterviewPacketContentType {
  rounds: Round[];
  leadership_framework?: string; // e.g. 'amazon_lp'
}

export interface InterviewPacket {
  id: string;
  user_id: string;
  job_title: string;
  job_description: string;
  company_name: string | null;
  round_template_id: string | null;
  status: string;
  content: InterviewPacketContentType;
  candidate_snapshot: CandidateSnapshot | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
