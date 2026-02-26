import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";
import { LoginModal } from "@/components/ui/login-modal";
import { MeetingPageHeader } from "@/components/layouts/MeetingPageHeader";
import Footer from "@/components/layouts/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Loader2, FileText, ListChecks, Sparkles } from "lucide-react";

/**
 * Purchase flow for Interview Packet: pay first (Stripe), then packet is generated after payment.
 * User fills form → clicks "Pay with Stripe" → redirects to Stripe Checkout → after success, backend
 * creates the packet (e.g. via webhook or success callback). No packet is created before payment.
 */
export default function InterviewPacketBuyPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectingToCheckout, setRedirectingToCheckout] = useState(false);

  const isDark = theme === "dark";
  const isLoggedIn = !!user;

  async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message =
        (data && (data.message || data.error)) || `Request failed with status ${res.status}`;
      const err = new Error(message) as Error & { status?: number; code?: string };
      err.status = res.status;
      err.code = (data as { code?: string })?.code;
      throw err;
    }

    return data;
  }

  /** Pay first via Stripe; packet is generated only after successful payment (backend creates it). */
  async function handlePayAndGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    setError(null);
    setLoading(true);
    setRedirectingToCheckout(true);

    try {
      // Store pending job info so success page can wait until this packet appears
      try {
        localStorage.setItem(
          "interview_packet_pending_job",
          JSON.stringify({
            job_title: jobTitle,
            job_description: jobDescription,
            company_name: companyName,
            created_at: new Date().toISOString(),
          })
        );
      } catch {
        // ignore storage errors
      }

      const res = await apiFetch<{ data?: { url?: string }; url?: string }>(
        "/interview-packet/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            job_title: jobTitle,
            job_description: jobDescription,
            company_name: companyName,
          }),
        }
      );
      const url =
        (res as { data?: { url?: string }; url?: string })?.data?.url ??
        (res as { url?: string })?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      setError("Checkout URL not returned");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
    } finally {
      setLoading(false);
      setRedirectingToCheckout(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute top-0 z-0 h-full w-full bg-white dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.28),rgba(255,255,255,0))]" />
      {!isDark && <RetroGrid angle={65} className="z-0 opacity-40" />}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      <MeetingPageHeader />

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />

      <main className="relative z-10 mx-auto max-w-6xl px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16 md:pt-24 md:pb-24 space-y-8">
        <div className="mx-auto mb-4 max-w-4xl px-1 text-center sm:mb-8">
          <SpotlightHeading className="mb-3 w-full sm:mb-4">
            <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl">
              <span className="block whitespace-nowrap bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.85)_100%)]">
                Buy & generate your Interview Packet
              </span>
              <span className="mt-1 block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-purple-300 dark:to-pink-200">
                one-time purchase · practice real questions, round by round
              </span>
            </h1>
          </SpotlightHeading>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg"
          >
            Paste a job description and we&apos;ll build a full interview packet: rounds,
            behavioral and coding questions, STAR answers, and practice links.
          </motion.p>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {(loading || redirectingToCheckout) && (
            <div className="rounded border border-blue-400 bg-blue-50 p-3 text-sm dark:border-blue-800 dark:bg-blue-950/40">
              Redirecting to Stripe secure checkout…
            </div>
          )}
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="min-w-0"
          >
            <Card className="border-border bg-card/95 shadow-xl backdrop-blur dark:bg-card/90">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Generate new packet</CardTitle>
                <CardDescription className="text-sm">
                  Enter a job you&apos;re targeting. You&apos;ll pay with Stripe first; your interview
                  packet is generated only after payment succeeds. Then view it under Dashboard → Interview Packets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 p-4 pt-0 sm:p-6">
                <form onSubmit={handlePayAndGenerate} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Job Title</Label>
                      <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Senior Backend Engineer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm">Company Name</Label>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Amazon, Google, etc."
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm">Job Description</Label>
                    <textarea
                      className="min-h-[8rem] w-full rounded-md border bg-background px-2 py-2 text-sm"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="mt-1 w-full min-h-10"
                    disabled={loading || redirectingToCheckout}
                  >
                    {loading || redirectingToCheckout ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting to payment…
                      </>
                    ) : (
                      "Pay & Generate Your Packet"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <div className="min-w-0 space-y-4 md:sticky md:top-24">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="min-w-0"
            >
              <Card className="mb-4 border border-border bg-card/80 shadow-xl backdrop-blur-sm dark:bg-card/50 dark:shadow-primary/5">
                <CardHeader className="space-y-2 p-4 sm:space-y-3 sm:p-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="shrink-0 rounded-lg bg-primary/10 p-2">
                      <FileText className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    </div>
                    <CardTitle className="break-words text-lg leading-snug sm:text-xl md:text-2xl">
                      What&apos;s inside your packet
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground sm:text-base">
                    Multi-round structure, questions, answers, and practice links tailored to the
                    job.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 pt-0 sm:space-y-5 sm:p-6">
                  <ul className="space-y-3 text-sm text-muted-foreground sm:space-y-4 sm:text-base">
                    <li className="flex items-start gap-2">
                      <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>Round-by-round: phone screen, technical, behavioral, system design.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        Behavioral questions & answers based on amazon leadership principles.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>You Will Get 8 Follow-up Questions For Every Round Each Question.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>Coding questions and practice links by difficulty and topic.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>After purchase, view and manage packets from Dashboard → Interview Packets.</span>
                    </li>

                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
