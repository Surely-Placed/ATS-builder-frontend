import { motion } from "framer-motion";
import { Zap, Target, TrendingUp, Users, Sparkles, Video, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";
import { FeatureCard } from "./FeatureCard";
import { ATSOptimizationCard } from "./ATSOptimizationCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Features
          </span>
          <SpotlightHeading className="w-full">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 whitespace-nowrap flex flex-wrap justify-center">
              {"Powerful Features for ".split(" ").map((word, index) => (
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
              {"Resume Success".split(" ").map((word, index) => (
                <motion.span
                  key={`gradient-${index}`}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: (4 + index) * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className="text-gradient mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </SpotlightHeading>
          <p className="text-muted-foreground text-lg">
            Profile-based resume builder. Paste any job, get a tailored resume without any file uploads.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]"
        >
          <ATSOptimizationCard variants={itemVariants} />

          <FeatureCard
            icon={Zap}
            title="No File Upload"
            description="Use structured resume details in your profile—experience, skills, projects. One setup, every job."
            variants={itemVariants}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">Profile-based</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Edit once, apply everywhere</p>
          </FeatureCard>

          <FeatureCard
            icon={Target}
            title="Job-Tailored Content"
            description="AI improves your summary, experience, and skills for each role you target."
            variants={itemVariants}
          >
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Summary
              </Badge>
              <Badge variant="outline" className="text-xs">
                Experience
              </Badge>
              <Badge variant="outline" className="text-xs">
                Skills
              </Badge>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Users}
            title="Built for Every Application"
            description="Paste any job from any board. Get a tailored resume and score for each role."
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">One profile</span>
              <span className="text-xs text-muted-foreground">· many jobs · many PDFs</span>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Sparkles}
            title="Optimized PDF"
            description="Generate a clean, ATS-friendly resume PDF in seconds. Download and submit."
            variants={itemVariants}
          />

          <FeatureCard
            icon={Video}
            title="1:1 Resume Call"
            description="Book a 30-minute video call with an engineer. Get resume feedback, ATS tips, and a Google Meet link after payment. Open to everyone—guest or logged in."
            variants={itemVariants}
          >
            <Link to="/meeting">
              <Button variant="outline" size="sm" className="mt-2">
                Book a call
              </Button>
            </Link>
          </FeatureCard>

          <FeatureCard
            icon={Briefcase}
            title="Interview Packet"
            description="Paste a job description and get a full interview packet: rounds, behavioral and coding questions, Get answers based on amazon leadership principles, and AI follow-ups. One-time purchase, practice at your pace."
            variants={itemVariants}
          >
            <Link to="/interview-packet/buy">
              <Button variant="outline" size="sm" className="mt-2">
                Get your packet
              </Button>
            </Link>
          </FeatureCard>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
