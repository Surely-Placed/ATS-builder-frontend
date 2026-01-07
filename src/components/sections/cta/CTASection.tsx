import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";
import { ContactFormDialog } from "./ContactFormDialog";

/**
 * CTA Section component - Modular structure
 * Composed of smaller components for better maintainability
 */
export default function CTASection() {
  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 radial-gradient" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-glow-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Free to Try</span>
          </div>

          {/* Headline */}
          <SpotlightHeading className="w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 flex flex-wrap justify-center">
              {"Stop Guessing.".split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="mr-2"
                >
                  {word}
                </motion.span>
              ))}
              <br className="block w-full" />
              {"Let AI Perfect Your Resume.".split(" ").map((word, index) => (
                <motion.span
                  key={`gradient-${index}`}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: (2 + index) * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="text-gradient mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </SpotlightHeading>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of job seekers who landed their dream jobs with ATS-optimized resumes.
            Your next opportunity is one upload away.
          </p>

          {/* CTA Button with Dialog */}
          <ContactFormDialog />

          {/* Trust Note */}
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Instant results • 100% secure
          </p>
        </motion.div>
      </div>
    </section>
  );
}
