"use client";

import { cn } from "@/lib/utils";
import { Layers, Search, Zap, Globe, Upload } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type React from "react";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";
import { useRef } from "react";

// The main props for the HowItWorks component
interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {}

// The props for a single step card
interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  index: number;
}

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

/**
 * A single step card within the "How It Works" section.
 * It displays an icon, title, description, and a list of benefits.
 * Now with 3D tilt animation effect.
 */
const StepCard: React.FC<StepCardProps> = ({ icon, title, description, benefits, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -12;
    const rotationY = (offsetX / (rect.width / 2)) * 12;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseEnter() {
    scale.set(1.05);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl border bg-card p-6 text-card-foreground transition-all duration-300 ease-in-out",
        "[perspective:800px]"
      )}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
        {icon}
      </div>
      {/* Title and Description */}
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-6 text-muted-foreground">{description}</p>
      {/* Benefits List */}
      <ul className="space-y-3">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

/**
 * A responsive "How It Works" section that displays a 4-step process.
 * It is styled with shadcn/ui theme variables to support light and dark modes.
 */
export const HowItWorks: React.FC<HowItWorksProps> = ({ className, ...props }) => {
  const stepsData = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Paste Job Details",
      description:
        "Simply paste the job title and job description from any job portal or company career page.",
      benefits: [
        "Paste job title & full description directly",
        "Works with LinkedIn, Indeed, Glassdoor & more",
        "No need to save or track job links",
      ],
    },
    
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload Resume",
      description: "Drop your PDF or DOCX file. We support all standard resume formats.",
      benefits: ["Instant file analysis", "Secure data handling", "All formats supported"],
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "AI Analyzes",
      description:
        "Our AI scans for ATS compatibility issues, formatting errors, and missing keywords.",
      benefits: ["Deep content analysis", "ATS compatibility check", "Keyword optimization"],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Download Perfect PDF",
      description: "Get your ATS-optimized resume instantly. Ready to apply.",
      benefits: ["Professional formatting", "ATS-friendly structure", "Instant download"],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full bg-background py-16 sm:py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <SpotlightHeading className="w-full">
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl flex flex-wrap justify-center">
              {"How it works".split(" ").map((word, index) => (
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
                  className={index === 2 ? "text-gradient mr-2" : "mr-2"}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </SpotlightHeading>
          <p className="mt-4 text-lg text-muted-foreground">
            Four simple steps. Zero manual work. Maximum results.
          </p>
        </motion.div>

        {/* Step Indicators with Connecting Line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative mx-auto mb-8 w-full max-w-6xl"
        >
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] top-1/2 h-0.5 w-[75%] -translate-y-1/2 bg-border"
          ></div>
          {/* Use grid to align numbers with the card grid below */}
          <div className="relative grid grid-cols-4">
            {stepsData.map((_, index) => (
              <div
                key={index}
                // Center the number within its grid column
                className="flex h-8 w-8 items-center justify-center justify-self-center rounded-full bg-muted font-semibold text-foreground ring-4 ring-background"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Steps Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
