import { motion, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CVMockupProps {
  scrollYProgress: any;
  opacity: any;
}

export const CVMockup = ({ scrollYProgress, opacity }: CVMockupProps) => {
  const cvY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const cvRotateX = useTransform(scrollYProgress, [0, 1], [55, 35]);
  const cvScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  const floatingChips = [
    { text: "Spelling: 'Received'", position: "left-[8%] top-[35%]", delay: 0 },
    {
      text: "Try: 'Improved website UI, increasing conversion by 24%.'",
      position: "right-[5%] top-[30%]",
      delay: 0.2,
    },
    {
      text: "Use: 'Managed projects...' for a stronger tone",
      position: "left-[5%] bottom-[15%]",
      delay: 0.4,
    },
  ];

  return (
    <motion.div className="relative max-w-4xl mx-auto" style={{ opacity }}>
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
              background: "rgba(20, 25, 50, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5b66f5]" />
            <span className="text-white">{chip.text}</span>
          </div>
        </motion.div>
      ))}

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
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-40 blur-3xl rounded-full"
          style={{ background: "rgba(91, 102, 245, 0.3)" }}
        />

        <div
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto transition-transform duration-300"
          style={{
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
            transform: "perspective(1000px) rotateX(5deg)",
          }}
        >
          <div className="p-8 grid grid-cols-3 gap-8">
            <div className="space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
                  activities
                </h3>
                <div className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>🎭 ⚽ 🎮</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
                  contact
                </h3>
                <div className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>+49-999-33-33599</p>
                  <p>sample@sample.com</p>
                  <p>randomcareer.360@gmail.com</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Node.js", "Python", "AWS", "Docker", "SQL"].map((skill, i) => (
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
            <div className="col-span-2 space-y-5 text-left">
              {[
                {
                  title: "Senior Developer",
                  company: "Acme Visualize",
                  dates: "June 2020 - Dec 2023",
                  bullets: [
                    "Designed Youtube (brand) and travslated for in-house brands.",
                    "Designing elements for YouTube videos.",
                    "Principle of designing.",
                    "Designing Program sites like Zoom/WebEx Townhall, Roundtables, etc.",
                    "Editorial design (assets for web/community like team blog) work",
                  ],
                },
                {
                  title: "Full Stack Engineer",
                  company: "Tech Innovators Ltd, New Delhi",
                  dates: "Jan 2018 - May 2020",
                  bullets: [
                    "Managed social media creatives for e-commerce giants like Flipkart and Myntra.",
                    "Led team of 5 designers and developers.",
                    "Improved website UI, increasing conversion by 24%.",
                  ],
                },
              ].map((exp, expIndex) => (
                <motion.div
                  key={expIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + expIndex * 0.2 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {exp.title}
                    </h3>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">{exp.dates}</span>
                  </div>
                  <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {exp.company}
                  </p>
                  <ul className="space-y-1 text-[9px] text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <div
            className="px-10 py-3 rounded-full backdrop-blur-md"
            style={{
              background: "#5b66f5",
              boxShadow: "0 0 40px rgba(91, 102, 245, 0.3)",
            }}
          >
            <span className="text-base font-semibold text-white">67% match</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
