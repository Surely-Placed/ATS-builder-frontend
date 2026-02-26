import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SubscriptionCancel() {
  const navigate = useNavigate();
  const loc = useLocation();

  const query = new URLSearchParams(loc.search);
  const type = query.get('type');
  const isInterviewPacket =
    loc.pathname.includes('interview-packet') || type === 'interview_packet';

  useEffect(() => {
    // subtle shake or other attention effect could be added here
  }, []);

  return (
    <DashboardLayout activeTab="Profile">
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto mb-4">
            <circle cx="60" cy="60" r="50" fill="#ef4444" />
            <g stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M40 40 L80 80" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'drawx 500ms ease forwards' }} />
              <path d="M80 40 L40 80" style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'drawx 500ms ease forwards 120ms' }} />
            </g>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-4">
          {isInterviewPacket
            ? "The Interview Packet checkout was cancelled. You can try again anytime."
            : "The checkout was cancelled. You can continue using the free tier or try again."}
        </p>
        <div className="flex justify-center gap-3">
          {isInterviewPacket ? (
            <>
              <Button onClick={() => navigate('/interview-packet')}>Go to Interview Packets</Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>Manage Account</Button>
            </>
          )}
        </div>

        <style>{`@keyframes drawx { to { stroke-dashoffset: 0; } }`}</style>
      </div>
    </DashboardLayout>
  );
}
