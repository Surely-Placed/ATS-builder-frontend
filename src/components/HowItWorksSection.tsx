import { motion } from "framer-motion";
import { Upload, Brain, Wrench, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Resume",
    description: "Drop your PDF or DOCX file. We support all standard resume formats.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analyzes",
    description: "Our AI scans for ATS compatibility issues, formatting errors, and missing keywords.",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Auto-Fix Applied",
    description: "AI rewrites, optimizes, and enhances your resume automatically.",
  },
  {
    icon: Download,
    step: "04",
    title: "Download Perfect PDF",
    description: "Get your ATS-optimized resume instantly. Ready to apply.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            From Upload to <span className="text-gradient">Perfect Resume</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps. Zero manual work. Maximum results.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent transform -translate-y-1/2" />

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Card */}
                <div className="glass-card p-6 text-center relative glow-hover">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs font-bold text-primary bg-background px-3 py-1 rounded-full border border-primary/30">
                      {step.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mt-4 mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <step.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on mobile, between cards on desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
