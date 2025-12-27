import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [
        "hsl(var(--primary))",
        "hsl(var(--accent))",
        "hsl(var(--secondary))",
      ],
    });

    // Reset form and close sheet after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
      setIsOpen(false);
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
              {"Stop Guessing.".split(' ').map((word, index) => (
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
              <br className="block w-full" />
              {"Let AI Perfect Your Resume.".split(' ').map((word, index) => (
                <motion.span
                  key={`gradient-${index}`}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: (2 + index) * 0.1,
                    ease: [0.25, 0.4, 0.25, 1]
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
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="hero" size="xl" className="group">
                  Contact Us
                  <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Background Effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
                
                {/* Dotted Pattern */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                  opacity: 0.1,
                }} />
                
                {/* Gradient Orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative z-10">
                <DialogHeader className="space-y-4 mb-8">
                  {/* Decorative Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto"
                  >
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 shadow-lg">
                      <Sparkles className="w-10 h-10 text-primary-foreground" />
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-primary"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <DialogTitle className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                      Get in <span className="text-gradient">Touch</span>
                    </DialogTitle>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DialogDescription className="text-center text-base max-w-md mx-auto">
                      Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </DialogDescription>
                  </motion.div>
                  
                  {/* Decorative Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-24 h-1 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                  />
                </DialogHeader>
              
                <form onSubmit={handleSubmit} className="space-y-6 px-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Your Name
                    </label>
                    <div className="relative group">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full h-14 text-base border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-background/50 backdrop-blur-sm"
                        disabled={isSubmitted}
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full h-14 text-base border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-background/50 backdrop-blur-sm"
                        disabled={isSubmitted}
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Message
                    </label>
                    <div className="relative group">
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        className="w-full resize-none text-base border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 bg-background/50 backdrop-blur-sm"
                        disabled={isSubmitted}
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading || isSubmitted}
                      className="w-full h-14 text-lg font-semibold relative overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                      size="lg"
                    >
                      {isSubmitted ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-6 w-6" />
                          Message Sent!
                        </motion.span>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center gap-2">
                            {isLoading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                                />
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Message
                                <Send className="h-5 w-5" />
                              </>
                            )}
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/25 to-primary/0"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Trust Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>We typically respond within 24 hours</span>
                  </motion.div>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Trust Note */}
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Instant results • 100% secure
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
