import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle2 } from 'lucide-react';
import { UseContactFormReturn } from '@/hooks/useContactForm';

interface ContactFormProps {
  form: UseContactFormReturn;
}

/**
 * Contact form component with animated inputs
 */
export function ContactForm({ form }: ContactFormProps) {
  const { formData, isSubmitted, isLoading, handleChange, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-foreground"
        >
          Your Name
        </label>
        <div className="relative group">
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full h-14 text-base border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-background/50 backdrop-blur-sm"
            disabled={isSubmitted}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-2"
      >
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-foreground"
        >
          Email Address
        </label>
        <div className="relative group">
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full h-14 text-base border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-background/50 backdrop-blur-sm"
            disabled={isSubmitted}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-2"
      >
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-foreground"
        >
          Message
        </label>
        <div className="relative group">
          <Textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help you..."
            rows={5}
            className="w-full resize-none text-base border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-background/50 backdrop-blur-sm"
            disabled={isSubmitted}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          type="submit"
          disabled={isLoading || isSubmitted}
          className="w-full h-14 text-lg font-semibold relative overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
          size="lg"
        >
          {isSubmitted ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-6 w-6" />
              Message Sent!
            </motion.span>
          ) : (
            <>
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-5 w-5" />
                  </>
                )}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/25 to-primary/0"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </>
          )}
        </Button>
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>We typically respond within 24 hours</span>
      </motion.div>
    </form>
  );
}

