import { motion } from "framer-motion";
import { ScanSearch, Wand2, KeyRound, FileDown } from "lucide-react";

const features = [
  {
    icon: ScanSearch,
    title: "Deep ATS Resume Analysis",
    description:
      "Our AI scans every section of your resume against real ATS algorithms used by Fortune 500 companies.",
  },
  {
    icon: Wand2,
    title: "AI-Powered Auto Fix",
    description:
      "No manual editing needed. AI automatically rewrites, restructures, and formats your resume for maximum impact.",
  },
  {
    icon: KeyRound,
    title: "Keyword Optimization",
    description:
      "Smart keyword injection based on job descriptions and industry standards to boost your visibility.",
  },
  {
    icon: FileDown,
    title: "Same Document Updated",
    description:
      "Your original resume is enhanced and returned. Download the ATS-optimized PDF instantly.",
  },
];

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
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Features
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Beat the Bots</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Powered by advanced AI trained on millions of successful resumes and real ATS systems.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="glass-card p-8 h-full glow-hover relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
