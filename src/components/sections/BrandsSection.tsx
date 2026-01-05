import { motion } from "framer-motion";
import { BrandScroller, BrandScrollerReverse } from "@/components/ui/brand-scroller";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";

const BrandsSection = () => {
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
          <SpotlightHeading className="w-full">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2 flex flex-wrap justify-center">
              {"Trusted by Professionals".split(' ').map((word, index) => (
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
                  className={index === 2 ? "text-gradient mr-2" : "mr-2"}
                >
                  {word}
                </motion.span>
              ))}
            </p>
            <h2 className="text-xl text-muted-foreground">
              Job seekers who landed roles at top companies
            </h2>
          </SpotlightHeading>
        </motion.div>

        {/* Brand Scrollers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <BrandScroller />
          <BrandScrollerReverse />
        </motion.div>
      </div>
    </section>
  );
};

export default BrandsSection;
