import { motion } from "framer-motion";
import { BrandScroller, BrandScrollerReverse } from "@/components/ui/brand-scroller";

const TrustSection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
            Trusted by Professionals
          </p>
          <h2 className="text-xl text-muted-foreground">
            Job seekers who landed roles at top companies
          </h2>
        </motion.div>

        {/* Brand Scrollers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 space-y-4"
        >
          <BrandScroller />
          <BrandScrollerReverse />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 border-t border-glass-border"
        >
          {[
            { value: "50K+", label: "Resumes Optimized" },
            { value: "95%", label: "ATS Pass Rate" },
            { value: "3x", label: "More Interviews" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
