import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/context/AuthContext';

const PACKET_STEPS = [
  'Understanding job description',
  'Analyzing role & requirements',
  'Reviewing your profile',
  'Generating interview rounds',
  'Preparing questions & answers',
  'Creating follow-up scenarios',
  'Finalizing your packet',
];

function runConfetti(container: HTMLDivElement | null) {
  if (!container) return;
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.pointerEvents = 'none';
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
  const pieces: Array<any> = [];
  for (let i = 0; i < 80; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      vx: (Math.random() - 0.5) * 6,
      vy: 2 + Math.random() * 6,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
    });
  }

  let raf: number;
  const start = performance.now();
  function frame() {
    const t = performance.now() - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    if (t < 2500) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  }
  raf = requestAnimationFrame(frame);
}

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [packetStatus, setPacketStatus] = useState<'idle' | 'creating' | 'error'>('idle');
  const [packetError, setPacketError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastStepIndex = PACKET_STEPS.length - 1;

  const query = new URLSearchParams(loc.search);
  const type = query.get('type');
  const sessionId = query.get('session_id');
  const booked = query.get('booked') === '1';
  const isMeeting = loc.pathname.includes('meeting') || type === 'meeting';
  const isInterviewPacket =
    !isMeeting && (loc.pathname.includes('interview-packet') || type === 'interview_packet');

  const isMeetingPayment = isMeeting && sessionId && !booked;
  const isMeetingBooked = isMeeting && booked;

  useEffect(() => {
    runConfetti(containerRef.current);
  }, []);

  // Progress: advance steps 0 → last once (never go back); then stay on last step revolving until success
  useEffect(() => {
    if (packetStatus !== 'creating') {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      stepIntervalRef.current = null;
      progressIntervalRef.current = null;
      if (packetStatus === 'idle') {
        setProgressPercent(0);
        setCurrentStepIndex(0);
      }
      return;
    }
    setCurrentStepIndex(0);
    setProgressPercent(5);
    stepIntervalRef.current = setInterval(() => {
      setCurrentStepIndex((i) => Math.min(i + 1, lastStepIndex));
    }, 2500);
    progressIntervalRef.current = setInterval(() => {
      setProgressPercent((p) => Math.min(p + Math.random() * 3 + 1, 88));
    }, 2000);
    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [packetStatus, lastStepIndex]);

  // For interview packet: one POST after payment to generate the full packet (questions, answers, and follow-ups) together
  useEffect(() => {
    if (!isInterviewPacket || !sessionId) return;

    let cancelled = false;

    let pendingJob:
      | { job_title?: string; job_description?: string; company_name?: string | null }
      | null = null;
    try {
      const raw = localStorage.getItem('interview_packet_pending_job');
      if (raw) pendingJob = JSON.parse(raw);
    } catch {
      pendingJob = null;
    }

    if (!pendingJob?.job_title || !pendingJob?.job_description) {
      setPacketStatus('error');
      setPacketError(
        'We could not find the job details to generate your packet. Please go back and try again.'
      );
      return;
    }

    async function createPacket() {
      if (cancelled) return;
      setPacketStatus('creating');
      setPacketError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/interview-packet`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_title: pendingJob.job_title,
            job_description: pendingJob.job_description,
            company_name: pendingJob.company_name ?? null,
            generate_follow_ups: true, // backend generates questions, answers, and follow-ups together
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.message || json?.error || `Request failed (${res.status})`);
        }
        try {
          localStorage.removeItem('interview_packet_pending_job');
        } catch {}
        if (!cancelled) {
          navigate('/interview-packet', { replace: true });
        }
      } catch (e) {
        if (cancelled) return;
        setPacketError(
          e instanceof Error ? e.message : 'Failed to generate your interview packet.'
        );
        setPacketStatus('error');
      }
    }

    createPacket();

    return () => {
      cancelled = true;
    };
  }, [isInterviewPacket, sessionId, navigate]);


  return (
    <DashboardLayout activeTab="Profile">
      <div className="flex items-center justify-center min-h-[70vh] p-6">
        <div className="max-w-2xl mx-auto text-center relative" ref={containerRef}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="160" height="160" viewBox="0 0 120 120" className="mx-auto mb-6 success-pulse">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="60" cy="60" r="50" fill="#10b981" style={{ transformOrigin: 'center' }} filter="url(#glow)" />
            <path
              d="M40 62 L54 76 L80 44"
              fill="none"
              stroke="#fff"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 200, strokeDashoffset: 0 }}
            />
          </svg>
        </div>

        {isMeetingBooked && (
          <>
            <h1 className="text-2xl font-bold mb-4">Meeting booked successfully</h1>
            <p className="text-muted-foreground mb-6">We’ll send the meeting link and details to your email. </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate('/meeting')}>Book another call</Button>
              {user && (
                <Button variant="outline" onClick={() => navigate('/manage-meetings')}>
                  Go to meetings
                </Button>
              )}
            </div>
          </>
        )}

        {isMeetingPayment && (
          <>
            <h1 className="text-2xl font-bold mb-4">Payment received</h1>
            <p className="text-muted-foreground mb-6">Continue to pick your date and time to complete your booking.</p>
            <Button onClick={() => navigate(`/meeting?session_id=${encodeURIComponent(sessionId!)}`, { replace: true })}>
              Continue to pick time
            </Button>
          </>
        )}

        {isInterviewPacket && (
          <>
            <h1 className="text-2xl font-bold mb-4">Interview Packet purchased</h1>
            <p className="text-muted-foreground mb-4">
              {sessionId
                ? packetStatus === 'error'
                  ? `Payment successful, but we couldn't generate your packet yet. ${packetError ?? ''}`
                  : "Payment successful. Generating your interview packet..."
                : 'Your one-time Interview Packet purchase is active. You can now generate and practice with interview packets.'}
            </p>
            {sessionId && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                Note: Do not close or refresh this page until your packet is ready, Otherwise you may lose your payment.
              </p>
            )}
            {sessionId && packetStatus === 'creating' && (
              <div className="w-full max-w-md mx-auto mb-6 text-left space-y-4">
                <Progress value={progressPercent} className="h-2" />
                <ul className="space-y-2">
                  {PACKET_STEPS.map((label, i) => {
                    const isActive = i === currentStepIndex;
                    const isPast = i < currentStepIndex;
                    return (
                      <li
                        key={label}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                          isActive
                            ? 'text-violet-600 dark:text-violet-400 font-medium'
                            : isPast
                              ? 'text-gray-500 dark:text-gray-400'
                              : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {isPast ? (
                          <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : isActive ? (
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-500" />
                        ) : (
                          <span className="h-4 w-4 shrink-0 rounded-full border border-gray-300 dark:border-gray-600 w-4 block" />
                        )}
                        <span>{label}</span>
                        {isActive && (
                          <span className="ml-1 inline-block animate-pulse">…</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                  It can take 5–10 minutes because we're giving you the best results for your interview preparation.
                </p>
              </div>
            )}
            {(!sessionId || packetStatus === 'error') && (
              <div className="flex justify-center gap-3">
                <Button onClick={() => navigate('/interview-packet')}>Go to Interview Packets</Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              </div>
            )}
          </>
        )}

        {!isMeeting && !isInterviewPacket && (
          <>
            <h1 className="text-2xl font-bold mb-4">Subscription Successful</h1>
            <p className="text-muted-foreground mb-6">Thank you for upgrading — your subscription is now active.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>Manage Account</Button>
            </div>
          </>
        )}

        {isMeeting && !isMeetingPayment && !isMeetingBooked && (
          <>
            <h1 className="text-2xl font-bold mb-4">Payment received</h1>
            <p className="text-muted-foreground mb-6">Continue to pick your date and time to complete your booking.</p>
            <Button onClick={() => navigate('/meeting', { replace: true })}>Continue to pick time</Button>
          </>
        )}

        <style>{`
          .success-pulse {
            animation: success-scale 1600ms ease-in-out infinite;
          }
          @keyframes success-scale {
            0% { transform: scale(1); }
            50% { transform: scale(1.06); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
      </div>
    </DashboardLayout>
  );
}
