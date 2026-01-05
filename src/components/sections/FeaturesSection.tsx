import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, Users, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpotlightHeading } from '@/components/ui/spotlight-heading';
import { FeatureCard } from './FeatureCard';
import { ATSOptimizationCard } from './ATSOptimizationCard';

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
      type: 'spring' as const,
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
              {'Powerful Features for '.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                  whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
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
              {'Resume Success'.split(' ').map((word, index) => (
                <motion.span
                  key={`gradient-${index}`}
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                  whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
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
            Everything you need to create an ATS-optimized resume that gets you interviews.
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
            title="Instant Results"
            description="Get your optimized resume in seconds, not hours."
            variants={itemVariants}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">3s</span>
              <span className="text-sm text-muted-foreground">average time</span>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Target}
            title="Success Rate"
            description="Of resumes pass ATS screening"
            variants={itemVariants}
          >
            <Badge className="mb-3" variant="outline">
              Success Rate
            </Badge>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">95%</span>
              <span className="text-sm text-muted-foreground">Pass Rate</span>
            </div>
            <p className="text-xs text-muted-foreground">Of resumes pass ATS screening</p>
          </FeatureCard>

          <FeatureCard
            icon={Target}
            title="Smart Analysis"
            description="AI analyzes every section for maximum impact and relevance."
            variants={itemVariants}
          >
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Keywords
              </Badge>
              <Badge variant="outline" className="text-xs">
                Formatting
              </Badge>
              <Badge variant="outline" className="text-xs">
                Skills
              </Badge>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={TrendingUp}
            title="Interview Boost"
            description="Increase your interview chances by 3x with our optimization."
            variants={itemVariants}
          >
            <Button size="sm" className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </FeatureCard>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <FeatureCard
              icon={Users}
              title="Trusted by Professionals"
              description="Join thousands of job seekers who've landed their dream jobs."
              variants={undefined}
              className="h-full"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/photo-${1472099645785 + i}?w=40&h=40&fit=crop`}
                      alt="User"
                      className="w-8 h-8 rounded-full border-2 border-background"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">10,000+</span>
                <span className="text-xs text-muted-foreground">users</span>
              </div>
            </FeatureCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

