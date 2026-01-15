import React, { useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const containerRef = useRef<HTMLDivElement | null>(null);

  // optional: read query params like ?session_id=...
  const query = new URLSearchParams(loc.search);
  const session = query.get('session_id');

  useEffect(() => {
    // play confetti once when page loads
    runConfetti(containerRef.current);
  }, []);

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

        <h1 className="text-2xl font-bold mb-4">Subscription Successful</h1>
        <p className="text-muted-foreground mb-6">Thank you for upgrading — your subscription is now active.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          <Button variant="outline" onClick={() => navigate('/profile')}>Manage Account</Button>
        </div>

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
