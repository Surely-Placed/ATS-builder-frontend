import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

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
    { text: "Spelling: 'Received'", position: "left-[8%] top-[35%]", delay: 0 },
    { text: "Try: 'Improved website UI, increasing conversion by 24%.'", position: "right-[5%] top-[30%]", delay: 0.2 },
    { text: "Use: 'Managed projects...' for a stronger tone", position: "left-[5%] bottom-[15%]", delay: 0.4 },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0a0e27]" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      {/* Hero Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-30" 
           style={{
             background: 'radial-gradient(ellipse at center, rgba(91, 102, 245, 0.15), transparent 70%)'
           }} 
      />

      <div className="container mx-auto px-5 lg:px-20 relative z-10 max-w-[1280px]">
        <div className="max-w-[900px] mx-auto text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-[#0a0e27]" />
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-[#0a0e27]" />
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-red-500 border-2 border-[#0a0e27]" />
            </div>
            <span className="text-[0.875rem] text-[#a8b2d1] font-normal">Trusted by 100,000+ professionals worldwide</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-semibold mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff'
            }}
          >
            Build your CV
            <br />
            <span style={{ color: '#a8b2d1' }}>smarter, faster, better</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[700px] mx-auto mb-10"
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: '#a8b2d1'
            }}
          >
            AI-powered resume builder tailored to your dream job.
            <br />
            Get matched with the right keywords, tone, and layout — in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <button 
              className="px-8 py-3.5 rounded-lg text-base font-semibold text-white border-0 cursor-pointer transition-all duration-300"
              style={{
                background: '#5b66f5',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#7480ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(91, 102, 245, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#5b66f5';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
              }}
            >
              Build my CV
            </button>
            <button 
              className="px-8 py-3.5 rounded-lg text-base font-semibold text-white cursor-pointer transition-all duration-300"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Request demo
            </button>
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
              <div 
                className="backdrop-blur-md px-3 py-2 rounded-lg flex items-center gap-2 text-xs whitespace-nowrap shadow-xl transition-all duration-300"
                style={{
                  background: 'rgba(20, 25, 50, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5b66f5]" />
                <span className="text-white">{chip.text}</span>
              </div>
            </motion.div>
          ))}

          {/* CV Container with 3D Perspective */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              y: cvY,
              rotateX: cvRotateX,
              scale: cvScale,
              transformPerspective: 1000,
            }}
            className="relative mx-auto max-w-[900px]"
          >
            {/* Glow Effect Under CV */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-40 blur-3xl rounded-full" 
                 style={{ background: 'rgba(91, 102, 245, 0.3)' }} 
            />
            
            {/* CV Card */}
            <div 
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto transition-transform duration-300"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                transform: 'perspective(1000px) rotateX(5deg)'
              }}
            >
              {/* CV Content */}
              <div className="p-8 grid grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6 text-left">
                  {/* Activities Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">activities</h3>
                    <div className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                      <p>🎭 ⚽ 🎮</p>
                    </div>
                  </motion.div>

                  {/* Contact Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">contact</h3>
                    <div className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                      <p>+49-999-33-33599</p>
                      <p>sample@sample.com</p>
                      <p>randomcareer.360@gmail.com</p>
                    </div>
                  </motion.div>

                  {/* Skills placeholder */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {['React', 'Node.js', 'Python', 'AWS', 'Docker', 'SQL'].map((skill, i) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.9 + i * 0.05 }}
                          className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded text-[9px] font-medium"
                        >
                          {skill}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="col-span-2 space-y-5 text-left">
                  {/* Experience 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">Senior Developer</h3>
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">June 2020 - Dec 2023</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-2">Acme Visualize</p>
                    <ul className="space-y-1 text-[9px] text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside">
                      <li>Designed Youtube (brand) and travslated for in-house brands.</li>
                      <li>Designing elements for YouTube videos.</li>
                      <li>Principle of designing.</li>
                      <li>Designing Program sites like Zoom/WebEx Townhall, Roundtables, etc.</li>
                      <li>Editorial design (assets for web/community like team blog) work</li>
                    </ul>
                  </motion.div>

                  {/* Experience 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">Full Stack Engineer</h3>
                      <span className="text-[9px] text-gray-500 dark:text-gray-400">Jan 2018 - May 2020</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-2">Tech Innovators Ltd, New Delhi</p>
                    <ul className="space-y-1 text-[9px] text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside">
                      <li>Managed social media creatives for e-commerce giants like Flipkart and Myntra.</li>
                      <li>Led team of 5 designers and developers.</li>
                      <li>Improved website UI, increasing conversion by 24%.</li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Match Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10"
            >
              <div 
                className="px-10 py-3 rounded-full backdrop-blur-md"
                style={{
                  background: '#5b66f5',
                  boxShadow: '0 0 40px rgba(91, 102, 245, 0.3)'
                }}
              >
                <span className="text-base font-semibold text-white">67% match</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
