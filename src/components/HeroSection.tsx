import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const cvY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const cvRotateX = useTransform(scrollYProgress, [0, 1], [55, 35]);
  const cvScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const floatingChips = [
    { text: "Spelling: 'Received'", position: "left-[5%] top-[35%]", delay: 0 },
    { text: "Try: 'Led a team of 5'", position: "right-[3%] top-[25%]", delay: 0.2 },
    { text: "Try: 'Improved website UI, increasing conversion by 24%.'", position: "right-[5%] top-[55%]", delay: 0.4 },
    { text: "Use: 'Managed projects...' for a stronger tone", position: "left-[3%] bottom-[25%]", delay: 0.6 },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-start pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-glow-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-muted/50 border border-border/50 mb-8"
          >
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="w-7 h-7 rounded-full bg-glow-secondary/20 border-2 border-background" />
              <div className="w-7 h-7 rounded-full bg-accent/30 border-2 border-background" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">Trusted by 100,000+ professionals worldwide</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
          >
            Build your CV{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">smarter, faster, better</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            AI-powered resume builder tailored to your dream job.
            <br className="hidden sm:block" />
            Get matched with the right keywords, tone, and layout — in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Button variant="glow" size="lg" className="px-8">
              Build my CV
            </Button>
            <Button variant="outline" size="lg" className="px-8 border-border/50 hover:bg-muted/50">
              Request demo
            </Button>
          </motion.div>
        </div>

        {/* 3D CV Mockup with Scroll Animation */}
        <motion.div 
          className="relative max-w-4xl mx-auto"
          style={{ opacity }}
        >
          {/* Floating AI Suggestion Chips */}
          {floatingChips.map((chip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + chip.delay }}
              className={`absolute ${chip.position} z-20 hidden lg:block`}
            >
              <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2 text-sm whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">{chip.text}</span>
              </div>
            </motion.div>
          ))}

          {/* CV Container with 3D Perspective */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ 
              y: cvY,
              rotateX: cvRotateX,
              scale: cvScale,
              transformPerspective: 1200,
            }}
            className="relative mx-auto"
          >
            {/* Glow Effect Under CV */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/30 blur-3xl rounded-full" />
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[60%] h-24 bg-glow-secondary/20 blur-2xl rounded-full" />
            
            {/* CV Card */}
            <div className="relative bg-card/90 backdrop-blur-sm border border-border/30 rounded-lg shadow-2xl overflow-hidden max-w-2xl mx-auto">
              {/* CV Header */}
              <div className="p-6 pb-4 border-b border-border/20">
                <div className="flex gap-6">
                  <div className="w-20 h-20 rounded-lg bg-muted/50 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-muted/50 rounded mb-2" />
                    <div className="h-3 w-32 bg-muted/30 rounded mb-3" />
                    <div className="flex gap-4">
                      <div className="h-2.5 w-20 bg-muted/30 rounded" />
                      <div className="h-2.5 w-24 bg-muted/30 rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Content */}
              <div className="p-6 grid grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <div className="h-3 w-16 bg-primary/30 rounded mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-muted/30 rounded" />
                      <div className="h-2 w-3/4 bg-muted/30 rounded" />
                      <div className="h-2 w-5/6 bg-muted/30 rounded" />
                    </div>
                  </div>
                  <div>
                    <div className="h-3 w-14 bg-primary/30 rounded mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-muted/30 rounded" />
                      <div className="h-2 w-2/3 bg-muted/30 rounded" />
                    </div>
                  </div>
                  <div>
                    <div className="h-3 w-20 bg-primary/30 rounded mb-2" />
                    <div className="flex flex-wrap gap-1.5">
                      {[1,2,3,4,5,6].map((i) => (
                        <div key={i} className="h-5 w-12 bg-muted/20 rounded" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-span-2 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-24 bg-primary/30 rounded" />
                      <div className="h-2 w-20 bg-muted/20 rounded" />
                    </div>
                    <div className="h-3 w-40 bg-muted/40 rounded mb-1.5" />
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-muted/20 rounded" />
                      <div className="h-2 w-full bg-muted/20 rounded" />
                      <div className="h-2 w-4/5 bg-muted/20 rounded" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-20 bg-primary/30 rounded" />
                      <div className="h-2 w-16 bg-muted/20 rounded" />
                    </div>
                    <div className="h-3 w-36 bg-muted/40 rounded mb-1.5" />
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-muted/20 rounded" />
                      <div className="h-2 w-full bg-muted/20 rounded" />
                      <div className="h-2 w-3/4 bg-muted/20 rounded" />
                      <div className="h-2 w-full bg-muted/20 rounded" />
                      <div className="h-2 w-2/3 bg-muted/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
              <div className="glass-card px-6 py-2 rounded-full">
                <span className="text-lg font-semibold text-gradient">67% match</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
