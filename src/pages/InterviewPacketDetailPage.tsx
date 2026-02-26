import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { API_BASE_URL } from "@/config/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { InterviewPacketDetails } from "@/features/interviewPacket/InterviewPacketDetails";
import type { InterviewPacket } from "@/features/interviewPacket";

async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error((data?.message || data?.error) || `Request failed ${res.status}`);
  }
  return data;
}

function PacketDetailInner() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [packet, setPacket] = useState<InterviewPacket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing packet id");
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const raw = await apiFetch<{ data?: InterviewPacket } | InterviewPacket>(
          `/interview-packet/${id}`
        );
        const data = (raw as { data?: InterviewPacket }).data ?? raw;
        if (!cancelled) {
          setPacket(data as InterviewPacket);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load interview packet");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
        <p className="text-sm text-gray-500">Loading interview packet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/interview-packet")}
          className="gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to packets
        </Button>
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      </div>
    );
  }

  if (!packet) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/interview-packet")}
          className="gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to packets
        </Button>
        <p className="text-sm text-gray-500">Interview packet not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] space-y-6 pb-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/interview-packet")}
        className="gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to packets
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <InterviewPacketDetails packet={packet} />
      </motion.div>
    </div>
  );
}

export default function InterviewPacketDetailPage() {
  return (
    <DashboardLayout activeTab="Interview Packets">
      <PacketDetailInner />
    </DashboardLayout>
  );
}
