import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function MeetingCancel() {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = (location.state as { error?: string } | null)?.error;
  const isError = Boolean(errorMessage);

  return (
    <DashboardLayout activeTab="Profile">
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-4">
            <circle cx="60" cy="60" r="50" fill="#ef4444" />
            <g stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M40 40 L80 80"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100,
                  animation: "drawx 500ms ease forwards",
                }}
              />
              <path
                d="M80 40 L40 80"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100,
                  animation: "drawx 500ms ease forwards 120ms",
                }}
              />
            </g>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {isError ? "Something went wrong" : "Meeting booking cancelled"}
        </h1>
        <p className="text-muted-foreground mb-4">
          {isError
            ? errorMessage
            : "The checkout was cancelled. You can book a Resume Justification Call anytime."}
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Button onClick={() => navigate("/meeting")}>
            {isError ? "Back to meeting" : "Book again"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>

        <style>{`@keyframes drawx { to { stroke-dashoffset: 0; } }`}</style>
      </div>
    </DashboardLayout>
  );
}
