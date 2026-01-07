import { useMemo, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { API_BASE_URL } from "@/config/api";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  sourceUrl?: string;
}

export interface UseContactFormReturn {
  formData: ContactFormData;
  isSubmitted: boolean;
  isLoading: boolean;
  status: null | { type: "success" | "error"; text: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

/**
 * Hook for managing contact form state and submission
 */
export function useContactForm(onSuccess?: () => void): UseContactFormReturn {
  const endpoint = useMemo(() => `${API_BASE_URL.replace(/\/$/, "")}/contact`, []);
  const sourceUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    company: "",
    sourceUrl,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<UseContactFormReturn["status"]>(null);

  const validateClient = useCallback((): string | null => {
    if (!formData.name.trim() || formData.name.trim().length < 2) return "Please enter your name.";
    if (!formData.email.trim()) return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      return "Please enter a valid email.";
    if (!formData.subject.trim() || formData.subject.trim().length < 2) return "Please enter a subject.";
    if (!formData.message.trim() || formData.message.trim().length < 5)
      return "Please enter a message (min 5 characters).";
    return null;
  }, [formData.email, formData.message, formData.name, formData.subject]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setStatus(null);
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setStatus(null);
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      phone: "",
      company: "",
      sourceUrl,
    });
  }, [sourceUrl]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus(null);

      const err = validateClient();
      if (err) {
        setStatus({ type: "error", text: err });
        return;
      }

      setIsLoading(true);

      try {
        const payload: ContactFormData = {
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          phone: formData.phone?.trim() || undefined,
          company: formData.company?.trim() || undefined,
          sourceUrl: formData.sourceUrl || sourceUrl,
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await res.json().catch(() => null)) as
          | { success?: boolean; message?: string; errors?: string }
          | null;

        if (!res.ok || data?.success === false) {
          const msg =
            data?.errors || data?.message || `Failed to send message (HTTP ${res.status}).`;
          setStatus({ type: "error", text: msg });
          return;
        }

        setIsSubmitted(true);
        setStatus({ type: "success", text: data?.message || "Message sent successfully." });

        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))"],
        });

        // Reset form and close dialog after a short delay
        setTimeout(() => {
          resetForm();
          if (onSuccess) onSuccess();
        }, 1500);
      } catch (error: any) {
        setStatus({
          type: "error",
          text: error?.message || "Network error. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, formData, onSuccess, resetForm, sourceUrl, validateClient]
  );

  return {
    formData,
    isSubmitted,
    isLoading,
    status,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
