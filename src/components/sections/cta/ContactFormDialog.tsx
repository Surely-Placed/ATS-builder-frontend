import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { useContactForm } from "@/hooks/useContactForm";

interface ContactFormDialogProps {
  trigger?: React.ReactNode;
}

/**
 * Contact form dialog component with animated header and form
 */
export function ContactFormDialog({ trigger }: ContactFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useContactForm(() => {
    setIsOpen(false);
  });

  const defaultTrigger = (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button variant="hero" size="xl" className="group">
        Contact Us
        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

          {/* Dotted Pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
              opacity: 0.1,
            }}
          />

          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10">
          <DialogHeader className="space-y-4 mb-8">
            {/* Decorative Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto"
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 shadow-lg">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DialogTitle className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Get in <span className="text-gradient">Touch</span>
              </DialogTitle>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DialogDescription className="text-center text-base max-w-md mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as
                soon as possible.
              </DialogDescription>
            </motion.div>

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
            />
          </DialogHeader>

          <ContactForm form={form} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
