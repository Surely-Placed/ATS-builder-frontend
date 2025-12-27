import { motion } from "framer-motion";
import { FileCheck, Zap, Target, TrendingUp, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";

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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
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
              {"Powerful Features for ".split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                  className="mr-2"
                >
                  {word}
                </motion.span>
              ))}
              {"Resume Success".split(' ').map((word, index) => (
                <motion.span
                  key={`gradient-${index}`}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: (4 + index) * 0.1,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                  className="text-gradient mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </SpotlightHeading>
          <p className="text-muted-foreground text-lg">
            Everything you need to create an ATS-optimized resume that gets you interviews.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]"
        >
          {/* ATS Optimization Card - Tall */}
          <motion.div variants={itemVariants} className="md:row-span-3">
            <Card className="p-6 h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg">ATS Optimization</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Paste your job posting URL, upload your resume, and let our AI do the rest. We automatically tailor your resume to match the job requirements with ATS-friendly formatting.
                </p>
                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Scrape Job Description</p>
                      <p className="text-xs text-muted-foreground">Paste the career page URL and we extract all key requirements, skills, and keywords from the job posting.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Analyze Your Resume</p>
                      <p className="text-xs text-muted-foreground">Our AI scans your uploaded resume for compatibility issues, missing keywords, and formatting errors.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Auto-Update PDF</p>
                      <p className="text-xs text-muted-foreground">Automatically applies ATS-friendly fixes, optimizes formatting, and enhances content to match the job description.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Download & Apply</p>
                      <p className="text-xs text-muted-foreground">Get your perfectly optimized, ATS-friendly resume ready to submit. No manual editing required.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Instant Results Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Instant Results</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get your optimized resume in seconds, not hours.
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">3s</span>
                <span className="text-sm text-muted-foreground">average time</span>
              </div>
            </Card>
          </motion.div>

          {/* Success Rate Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 h-full">
              <Badge className="mb-3" variant="outline">
                Success Rate
              </Badge>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">95%</span>
                <span className="text-sm text-muted-foreground">Pass Rate</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Of resumes pass ATS screening
              </p>
            </Card>
          </motion.div>

          {/* Smart Analysis Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Smart Analysis</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI analyzes every section for maximum impact and relevance.
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">Keywords</Badge>
                <Badge variant="outline" className="text-xs">Formatting</Badge>
                <Badge variant="outline" className="text-xs">Skills</Badge>
              </div>
            </Card>
          </motion.div>

          {/* Interview Boost Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-muted">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Interview Boost</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Increase your interview chances by 3x with our optimization.
              </p>
              <Button size="sm" className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </Card>
          </motion.div>

          {/* Trusted By Card - Wide */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card className="p-6 h-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold">Trusted by Professionals</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join thousands of job seekers who've landed their dream jobs.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"
                        alt="User"
                        className="w-8 h-8 rounded-full border-2 border-background"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop"
                        alt="User"
                        className="w-8 h-8 rounded-full border-2 border-background"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop"
                        alt="User"
                        className="w-8 h-8 rounded-full border-2 border-background"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                        alt="User"
                        className="w-8 h-8 rounded-full border-2 border-background"
                      />
                    </div>
                    <span className="text-sm font-semibold">10,000+</span>
                    <span className="text-xs text-muted-foreground">users</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
