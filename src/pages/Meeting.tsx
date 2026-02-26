import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { MeetingPageHeader } from "@/components/layouts/MeetingPageHeader";
import Footer from "@/components/layouts/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";
import { Video, Clock, User, FileText, Sparkles, Loader2, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";
import { RetroGrid } from "@/components/ui/retro-grid";

interface Slot {
  start: string;
  end: string;
  dateKey: string;
  labelDay: string;
  labelTime: string;
  labelTimeShort: string;
  booked?: boolean;
}

interface DateOption {
  dateKey: string;
  label: string;
}

const AVAILABILITY_DAYS = 14;

/** Working hours timezone (USA): slots display as 9:00 AM – 5:00 PM */
const SLOTS_TIMEZONE = "America/New_York";

/** Return true if the slot starts at or after the current time in USA Eastern (so we hide past slots) */
function isSlotStartNowOrFuture(slot: { start: string }, now: Date): boolean {
  const slotDate = new Date(slot.start);
  const slotDateKey = slotDate.toLocaleDateString("en-CA", { timeZone: SLOTS_TIMEZONE });
  const nowDateKey = now.toLocaleDateString("en-CA", { timeZone: SLOTS_TIMEZONE });
  if (slotDateKey > nowDateKey) return true;
  if (slotDateKey < nowDateKey) return false;
  const slotParts = new Intl.DateTimeFormat("en-US", {
    timeZone: SLOTS_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(slotDate);
  const nowParts = new Intl.DateTimeFormat("en-US", {
    timeZone: SLOTS_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const getHM = (parts: Intl.DateTimeFormatPart[]) => ({
    hour: parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10),
    minute: parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10),
  });
  const slotHM = getHM(slotParts);
  const nowHM = getHM(nowParts);
  return slotHM.hour > nowHM.hour || (slotHM.hour === nowHM.hour && slotHM.minute >= nowHM.minute);
}

/** Map API slot { start, end, available? } to our Slot shape; booked = !available. */
function mapApiSlotToSlot(api: { start: string; end: string; available?: boolean }): Slot {
  const startDate = new Date(api.start);
  const endDate = new Date(api.end);
  const dateKey = startDate.toLocaleDateString("en-CA", { timeZone: SLOTS_TIMEZONE }); // YYYY-MM-DD in Eastern
  const formatterDay = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: SLOTS_TIMEZONE,
  });
  const formatterTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: SLOTS_TIMEZONE,
  });
  const timeStr = formatterTime.format(startDate);
  return {
    start: api.start,
    end: api.end,
    dateKey,
    labelDay: formatterDay.format(startDate),
    labelTime: `${timeStr} - ${formatterTime.format(endDate)}`,
    labelTimeShort: timeStr,
    booked: api.available === false,
  };
}

// Availability: no cache, response shape { success: true, data: { slots } } or { slots }
const STORAGE_KEY = "meeting_booking";

export default function Meeting() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [sessionIdFromUrl, setSessionIdFromUrl] = useState<string | null>(null);
  const [successLoading, setSuccessLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slotsLoading = loadingSlots; // alias for compatibility

  /** Re-render every minute so past slots disappear as clock moves (e.g. after 4:30 PM) */
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const dateOptions = useMemo((): DateOption[] => {
    const byDate = new Map<string, string>();
    for (const s of slots) {
      if (!byDate.has(s.dateKey)) byDate.set(s.dateKey, s.start);
    }
    const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: SLOTS_TIMEZONE });
    const mo = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: SLOTS_TIMEZONE });
    const dayNum = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: SLOTS_TIMEZONE });
    return Array.from(byDate.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([dateKey, start]) => {
        const d = new Date(start);
        return { dateKey, label: `${wd.format(d)} ${dayNum.format(d)} ${mo.format(d)}` };
      });
  }, [slots]);

  const slotsByDateKey = useMemo(() => {
    const m = new Map<string, Slot[]>();
    for (const s of slots) {
      const list = m.get(s.dateKey) ?? [];
      list.push(s);
      m.set(s.dateKey, list);
    }
    return m;
  }, [slots]);

  /** Current time in USA Eastern: used to hide past slots regardless of user's timezone */
  const nowInEastern = new Date();

  /** Date options restricted to dates that have at least one future slot (by USA Eastern) */
  const dateOptionsFiltered = useMemo(() => {
    return dateOptions.filter((opt) =>
      (slotsByDateKey.get(opt.dateKey) ?? []).some((s) => isSlotStartNowOrFuture(s, nowInEastern))
    );
  }, [dateOptions, slotsByDateKey, nowInEastern.getTime()]);

  const timeSlotsForSelectedDate = selectedDate ? (slotsByDateKey.get(selectedDate) ?? []) : [];
  const effectiveDate = selectedDate ?? dateOptionsFiltered[0]?.dateKey ?? null;
  const effectiveTimeSlotsRaw = effectiveDate ? (slotsByDateKey.get(effectiveDate) ?? []) : [];
  /** Only show slots at or after current time in USA Eastern (e.g. at 4:30 PM hide 9 AM–4:00 PM) */
  const effectiveTimeSlots = useMemo(
    () => effectiveTimeSlotsRaw.filter((s) => isSlotStartNowOrFuture(s, nowInEastern)),
    [effectiveTimeSlotsRaw, nowInEastern.getTime()]
  );

  /** Today's dateKey (YYYY-MM-DD) in same timezone as slots (Eastern) for comparing with selected date */
  const todayDateKey = (() => {
    return new Date().toLocaleDateString("en-CA", { timeZone: SLOTS_TIMEZONE });
  })();

  /** True if the slot is already booked (past slots are filtered out above) */
  const isSlotDisabled = (slot: Slot) => slot.booked === true;

  // Fetch all slots (available + booked); booked will be disabled
  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/meetings/availability?days=${AVAILABILITY_DAYS}`,
          { cache: "no-store", headers: { Accept: "application/json" }, credentials: "include" }
        );
        const raw = await res.json();
        const data = raw?.data ?? raw;
        const list = Array.isArray(data?.slots) ? data.slots : [];
        const mapped = list.map((slot: { start: string; end: string; available?: boolean }) =>
          mapApiSlotToSlot(slot)
        );
        if (!cancelled) setSlots(mapped);
      } catch {
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 1) Read session_id from URL (after Stripe redirect)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (sid) setSessionIdFromUrl(sid);
  }, []);

  // 2) Success flow: verify then auto-book and set meet link
  useEffect(() => {
    if (!sessionIdFromUrl) return;

    setSuccessLoading(true);
    setError(null);

    fetch(
      `${API_BASE_URL}/meetings/verify-session?session_id=${encodeURIComponent(sessionIdFromUrl)}`,
      { cache: "no-store", credentials: "include" }
    )
      .then((r) => r.json())
      .then((body: { data?: { verified?: boolean; meet_link?: string }; verified?: boolean; meet_link?: string }) => {
        const data = body?.data ?? body;
        const verified = data?.verified === true;
        const existingLink = data?.meet_link;

        if (!verified) {
          setSuccessLoading(false);
          navigate("/meeting/cancel", { replace: true, state: { error: "Invalid or unpaid session." } });
          return;
        }
        if (existingLink) {
          setSessionIdFromUrl(null);
          sessionStorage.removeItem(STORAGE_KEY);
          setSuccessLoading(false);
          navigate("/meetings/success?booked=1", { replace: true });
          return;
        }

        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setSuccessLoading(false);
          navigate("/meeting/cancel", { replace: true, state: { error: "Session expired. Please book again from the start." } });
          return;
        }
        let parsed: {
          start?: string;
          invitee_email?: string;
          invitee_name?: string;
          invitee_mobile?: string;
          invitee_resume_url?: string;
        };
        try {
          parsed = JSON.parse(saved);
        } catch {
          setSuccessLoading(false);
          navigate("/meeting/cancel", { replace: true, state: { error: "Invalid saved data. Please book again." } });
          return;
        }
        const { start, invitee_email, invitee_name, invitee_mobile, invitee_resume_url } = parsed;
        if (!start || !invitee_email) {
          setSuccessLoading(false);
          navigate("/meeting/cancel", { replace: true, state: { error: "Missing slot or email. Please book again." } });
          return;
        }
        if (!parsed.invitee_mobile || !parsed.invitee_resume_url) {
          setSuccessLoading(false);
          navigate("/meeting/cancel", { replace: true, state: { error: "Missing phone or resume link. Please book again from the start." } });
          return;
        }

        return fetch(`${API_BASE_URL}/meetings/book`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            session_id: sessionIdFromUrl,
            start,
            invitee_email,
            invitee_name: invitee_name || undefined,
            invitee_mobile: invitee_mobile || undefined,
            invitee_resume_url: invitee_resume_url || undefined,
          }),
        }).then((r) => r.json());
      })
      .then((bookRes: { data?: { meet_link?: string }; meet_link?: string; error?: string } | undefined) => {
        if (!bookRes) return;
        const link = bookRes?.data?.meet_link ?? bookRes?.meet_link;
        if (link) {
          setSessionIdFromUrl(null);
          sessionStorage.removeItem(STORAGE_KEY);
          navigate("/meetings/success?booked=1", { replace: true });
        } else navigate("/meeting/cancel", { replace: true, state: { error: bookRes?.error || "Could not create meeting." } });
      })
      .catch(() => {
        setSuccessLoading(false);
        navigate("/meeting/cancel", { replace: true, state: { error: "Something went wrong." } });
      })
      .finally(() => setSuccessLoading(false));
  }, [sessionIdFromUrl, navigate]);

  useEffect(() => {
    if (selectedDate === null && dateOptionsFiltered.length > 0) setSelectedDate(dateOptionsFiltered[0].dateKey);
    if (selectedDate && !dateOptionsFiltered.some((o) => o.dateKey === selectedDate)) setSelectedDate(dateOptionsFiltered[0]?.dateKey ?? null);
  }, [dateOptionsFiltered, selectedDate]);

  const handlePay = async () => {
    setError(null);
    if (!selectedSlot) {
      setError("Please select an available slot.");
      return;
    }
    const slot = effectiveTimeSlots.find((s) => s.start === selectedSlot);
    if (slot?.booked) {
      setError("Please select an available slot.");
      return;
    }
    if (!email?.trim()) {
      setError("Email is required.");
      return;
    }
    if (!mobile?.trim()) {
      setError("Phone is required.");
      return;
    }
    if (!resumeUrl?.trim()) {
      setError("Resume link is required.");
      return;
    }
    setPayLoading(true);
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          start: selectedSlot,
          invitee_email: email.trim(),
          invitee_name: name?.trim() || undefined,
          invitee_mobile: mobile?.trim() || undefined,
          invitee_resume_url: resumeUrl?.trim() || undefined,
        })
      );

      const url = user
        ? `${API_BASE_URL}/meetings/checkout`
        : `${API_BASE_URL}/meetings/checkout/guest`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: user
          ? "{}"
          : JSON.stringify({ invitee_email: email.trim(), invitee_name: name?.trim() || undefined }),
      });
      const body = await res.json();
      const checkoutUrl = body?.data?.url ?? body?.url;
      if (!checkoutUrl || typeof checkoutUrl !== "string") {
        setError(body?.error || "Could not start checkout.");
        return;
      }
      window.location.href = checkoutUrl;
    } catch {
      setError("Could not start payment.");
    } finally {
      setPayLoading(false);
    }
  };

  const isDark = theme === "dark";

  const slotSelector = (
    <div className="space-y-6">
      {loadingSlots ? (
        <div className="flex items-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin shrink-0" />
          <span>Loading availability…</span>
        </div>
      ) : (
        <>
          {/* Section 1: Select an appointment date */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Select an appointment date</h3>
            <div className="relative flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30 snap-x snap-mandatory">
              {dateOptionsFiltered.length === 0 ? (
                <p className="text-sm text-muted-foreground">No availability in the next {AVAILABILITY_DAYS} days.</p>
              ) : (
                dateOptionsFiltered.map((opt) => {
                  const isSelected = effectiveDate === opt.dateKey;
                  return (
                    <button
                      key={opt.dateKey}
                      type="button"
                      onClick={() => {
                        setSelectedDate(opt.dateKey);
                        setSelectedSlot(null);
                      }}
                      className={cn(
                        "shrink-0 w-[88px] sm:w-[100px] min-h-[64px] py-2.5 sm:py-3 px-2 sm:px-3 rounded-lg border-2 text-center transition-all snap-start touch-manipulation",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-border bg-card hover:border-muted-foreground/50 hover:bg-muted/50 text-foreground"
                      )}
                    >
                      <span className="block text-xs font-medium opacity-90 truncate">{opt.label.split(" ")[0]}</span>
                      <span className="block text-xs sm:text-sm font-semibold mt-0.5 truncate">{opt.label.split(" ").slice(1).join(" ")}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Select your preferred start time */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Select your preferred start time</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Phone className="h-4 w-4" />
              <span>Working Hours</span>
              <span className="font-medium text-foreground">9:00 AM – 5:00 PM</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {effectiveTimeSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground col-span-2 sm:col-span-3">Select a date to see times.</p>
              ) : (
                effectiveTimeSlots.map((s) => {
                  const disabled = isSlotDisabled(s);
                  return (
                    <Button
                      key={s.start}
                      type="button"
                      variant={selectedSlot === s.start ? "default" : "outline"}
                      size="sm"
                      disabled={disabled}
                      onClick={() => !disabled && setSelectedSlot(s.start)}
                      className={cn(
                        "min-h-[2.5rem] h-10 py-2 text-xs sm:text-sm font-normal text-center whitespace-nowrap",
                        disabled && "cursor-not-allowed text-muted-foreground opacity-90"
                      )}
                    >
                      {s.labelTime}
                    </Button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const rightSideContent = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="min-w-0 w-full md:w-auto"
    >
      <Card className="border border-border bg-card/80 dark:bg-card/50 backdrop-blur-sm shadow-xl dark:shadow-primary/5">
        <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="rounded-lg bg-primary/10 p-2 shrink-0">
              <Video className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl break-words leading-snug">Resume justification 1:1 call - Jobrabbit</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base text-muted-foreground">
            30-minute 1:1 video call with a software engineer who will help you understand your resume and answer your doubts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6 pt-0">
          <ul className="space-y-3 sm:space-y-4">
            {[
              { icon: Clock, text: "30-minute dedicated slot (Mon–Fri, 9 AM–5 PM USA)" },
              { icon: User, text: "Understand your resume & get doubts clarified with a software engineer" },
              { icon: FileText, text: "ATS and structure feedback" },
              { icon: Sparkles, text: "Actionable next steps for your job search" },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-3">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs sm:text-sm text-muted-foreground border-t border-border pt-3 sm:pt-4">
            After payment you’ll pick your preferred time and receive a Google Meet link by email.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (sessionIdFromUrl && successLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <MeetingPageHeader />
        <main className="relative max-w-2xl mx-auto px-3 sm:px-4 py-16 sm:py-24 flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4 text-muted-foreground text-center">
            <Loader2 className="h-10 w-10 animate-spin shrink-0" />
            <p className="text-sm sm:text-base">Creating your meeting…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Landing-style background */}
      <div className="absolute top-0 z-0 h-full w-full bg-white dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.28),rgba(255,255,255,0))]" />
      {!isDark && <RetroGrid angle={65} className="opacity-40 z-0" />}
      {isDark && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      <MeetingPageHeader />

      <main className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 md:pt-24 md:pb-24">
        {/* Two-line heading: regular line + gradient line (landing style) */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-14 text-center px-1">
          <SpotlightHeading className="w-full mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight font-bold leading-tight">
              <span className="block bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.85)_100%)]">
                Book a 30-minute call with
              </span>
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-pink-200">
                get your resume justified
              </span>
            </h1>
          </SpotlightHeading>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground mt-3 sm:mt-4 max-w-xl mx-auto"
          >
            Pick your date and time, enter your details, then pay to secure your call. If payment fails, no meeting is scheduled.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="min-w-0"
          >
            <Card className="border-border shadow-xl bg-card/95 dark:bg-card/90 backdrop-blur">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl break-words">Resume justification 1:1 call - Jobrabbit</CardTitle>
                <CardDescription className="text-sm">
                  Enter your details, choose your date and time above, then pay to secure your booking. If payment fails, no meeting is scheduled.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6 pt-0 sm:pt-0">
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg break-words">{error}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Mobile <span className="text-destructive">*</span>
                    </Label>
                    <Input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+1 234 567 8900" />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Resume URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="Paste link after uploading resume"
                    />
                  </div>
                </div>

                <div className="pt-2">{slotSelector}</div>

                <p className="text-xs text-muted-foreground border border-border rounded-lg p-3 bg-muted/30 break-words">
                  By booking, you agree to our terms of service and privacy policy. This is a paid 30-minute 1:1 call; payment is non-refundable once the session is confirmed.
                </p>

                <Button
                  className="w-full mt-4 min-h-11 touch-manipulation"
                  onClick={handlePay}
                  disabled={
                  !email?.trim() ||
                  !selectedSlot ||
                  payLoading ||
                  !mobile?.trim() ||
                  !resumeUrl?.trim()
                }
                >
                  {payLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting to payment…
                    </>
                  ) : (
                    "Pay to continue"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <div className="w-full md:sticky md:top-24">{rightSideContent}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
