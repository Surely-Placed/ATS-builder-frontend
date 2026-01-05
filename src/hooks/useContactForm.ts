import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface UseContactFormReturn {
  formData: ContactFormData;
  isSubmitted: boolean;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

/**
 * Hook for managing contact form state and submission
 */
export function useContactForm(
  onSuccess?: () => void
): UseContactFormReturn {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        'hsl(var(--primary))',
        'hsl(var(--accent))',
        'hsl(var(--secondary))',
      ],
    });

    // Reset form and call success callback after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    }, 2000);
  }, [onSuccess]);

  const resetForm = useCallback(() => {
    setFormData({ name: '', email: '', message: '' });
  }, []);

  return {
    formData,
    isSubmitted,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm,
  };
}

