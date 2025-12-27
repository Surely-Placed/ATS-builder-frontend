import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { RetroGrid } from "@/components/ui/retro-grid"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import { SparklesCore } from "@/components/ui/sparkles"
import { useTheme } from "next-themes"
import BlurText from "@/components/BlurText"
import { useNavigate } from "react-router-dom"
import { SpotlightHeading } from "@/components/ui/spotlight-heading"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    gradient: string
  }
  description?: string
  ctaText?: string
  ctaHref?: string
  bottomImage?: {
    light: string
    dark: string
  }
  gridOptions?: {
    angle?: number
  }
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "Build products for everyone",
      subtitle = {
        regular: "Designing your projects faster with ",
        gradient: "the largest figma UI kit.",
      },
      description = "Sed ut perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae.",
      ctaText = "Browse courses",
      ctaHref = "#",
      bottomImage = {
        light: "https://farmui.vercel.app/dashboard-light.png",
        dark: "https://farmui.vercel.app/dashboard.png",
      },
      gridOptions,
      ...props
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isDark = theme === "dark";

    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <div className="absolute top-0 z-[0] h-screen w-screen bg-white dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <section className="relative max-w-full mx-auto z-1">
          {/* Show RetroGrid in light mode, Sparkles in dark mode */}
          {!isDark ? (
            <>
              <RetroGrid {...gridOptions} />
              {/* Dotted pattern overlay for light mode */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <SparklesCore
                id="tsparticlesherosection"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={1}
              />
            </div>
          )}
          <div className="max-w-screen-xl z-10 mx-auto px-4 pt-32 gap-12 md:px-8">
            <div className="space-y-8 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
              <h1 className="text-sm text-gray-600 dark:text-gray-400 group font-geist mx-auto px-5 py-2 bg-gradient-to-tr from-zinc-300/20 via-gray-400/20 to-transparent dark:from-zinc-300/5 dark:via-gray-400/5 border-[2px] border-black/5 dark:border-white/5 rounded-3xl w-fit">
                {title}
                <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
              </h1>
              <SpotlightHeading className="w-full">
                <h2 className="text-4xl tracking-tighter font-geist mx-auto md:text-6xl flex flex-wrap justify-center gap-x-3">
                  {subtitle.regular.split(' ').map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.25, 0.4, 0.25, 1]
                      }}
                      className="bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]"
                    >
                      {word}
                    </motion.span>
                  ))}
                  {subtitle.gradient.split(' ').map((word, index) => (
                    <motion.span
                      key={`gradient-${index}`}
                      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: (subtitle.regular.split(' ').length + index) * 0.1,
                        ease: [0.25, 0.4, 0.25, 1]
                      }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200"
                    >
                      {word}
                    </motion.span>
                  ))}
                </h2>
              </SpotlightHeading>
              <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                {description}
              </p>
              <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                  className="relative inline-flex rounded-full text-center group items-center justify-center bg-gradient-to-tr from-zinc-300/20 via-purple-400/30 to-transparent dark:from-zinc-300/5 dark:via-purple-400/20 text-gray-900 dark:text-white border-input border-[1px] hover:bg-gradient-to-tr hover:from-zinc-300/30 hover:via-purple-400/40 hover:to-transparent dark:hover:from-zinc-300/10 dark:hover:via-purple-400/30 transition-all py-4 px-10 cursor-pointer z-10 overflow-hidden"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] -z-10" />
                  <span className="relative z-10">{ctaText}</span>
                </button>
              </div>
            </div>
            
            {bottomImage && (
              <div className="-mt-72">
                <ContainerScroll titleComponent={<></>}>
                  <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden h-full">
                    {/* CV Content */}
                    <div 
                      className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      {/* Left Column */}
                      <div className="space-y-6 text-left border-r border-gray-200 dark:border-gray-700 pr-6">
                        {/* Profile Photo */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="mb-6"
                        >
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                            JD
                          </div>
                        </motion.div>

                        {/* Contact */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Contact</h3>
                          <div className="space-y-2 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>📧 john.doe@email.com</p>
                            <p>📱 +1-555-123-4567</p>
                            <p>🔗 linkedin.com/in/johndoe</p>
                            <p>🌐 johndoe.dev</p>
                          </div>
                        </motion.div>

                        {/* Skills */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Skills</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Kubernetes', 'CI/CD'].map((skill, i) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.7 + i * 0.03 }}
                                className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[9px] font-medium"
                              >
                                {skill}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Languages */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Languages</h3>
                          <div className="space-y-2 text-[10px] text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between items-center">
                              <span>English</span>
                              <span className="text-purple-600 dark:text-purple-400">Native</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Spanish</span>
                              <span className="text-purple-600 dark:text-purple-400">Fluent</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>French</span>
                              <span className="text-purple-600 dark:text-purple-400">Basic</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Certifications */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">Certifications</h3>
                          <div className="space-y-1.5 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>🏆 AWS Solutions Architect</p>
                            <p>🏆 Google Cloud Professional</p>
                            <p>🏆 React Advanced Patterns</p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6 text-left">
                        {/* Name & Title */}
                        <motion.div 
                          className="border-b border-gray-200 dark:border-gray-700 pb-4"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">John Doe</h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Senior Software Engineer</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                            Passionate software engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Specialized in modern JavaScript frameworks and cloud architecture.
                          </p>
                        </motion.div>

                        {/* Professional Summary */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">Professional Summary</h3>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                            Results-driven software engineer with expertise in full-stack development, microservices architecture, and DevOps practices. Proven track record of delivering high-quality software solutions that drive business growth and enhance user experience.
                          </p>
                        </motion.div>

                        {/* Experience 1 */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">Work Experience</h3>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Senior Software Engineer</h4>
                                  <p className="text-[10px] font-medium text-purple-600 dark:text-purple-400">Tech Innovators Inc.</p>
                                </div>
                                <span className="text-[9px] text-gray-500 dark:text-gray-400">2020 - Present</span>
                              </div>
                              <ul className="space-y-1 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside">
                                <li>Led development of microservices architecture serving 2M+ users</li>
                                <li>Improved system performance by 40% through optimization</li>
                                <li>Mentored team of 5 junior developers</li>
                                <li>Implemented CI/CD pipeline reducing deployment time by 60%</li>
                                <li>Architected and deployed cloud infrastructure on AWS</li>
                              </ul>
                            </div>

                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Full Stack Engineer</h4>
                                  <p className="text-[10px] font-medium text-purple-600 dark:text-purple-400">Digital Solutions Ltd.</p>
                                </div>
                                <span className="text-[9px] text-gray-500 dark:text-gray-400">2018 - 2020</span>
                              </div>
                              <ul className="space-y-1 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside">
                                <li>Built responsive web applications using React and Node.js</li>
                                <li>Increased user engagement by 35% through UX improvements</li>
                                <li>Developed RESTful APIs serving 500K+ daily requests</li>
                                <li>Collaborated with design team to implement pixel-perfect UIs</li>
                              </ul>
                            </div>

                            <div>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Junior Developer</h4>
                                  <p className="text-[10px] font-medium text-purple-600 dark:text-purple-400">StartUp Co.</p>
                                </div>
                                <span className="text-[9px] text-gray-500 dark:text-gray-400">2016 - 2018</span>
                              </div>
                              <ul className="space-y-1 text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside">
                                <li>Contributed to development of core product features</li>
                                <li>Fixed bugs and improved code quality through testing</li>
                                <li>Participated in agile development practices and code reviews</li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>

                        {/* Education */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">Education</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Master of Computer Science</h4>
                                  <p className="text-[10px] font-medium text-purple-600 dark:text-purple-400">Stanford University</p>
                                </div>
                                <span className="text-[9px] text-gray-500 dark:text-gray-400">2014 - 2016</span>
                              </div>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400">GPA: 3.9/4.0 • Focus: Software Engineering & AI</p>
                            </div>
                            <div>
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">Bachelor of Science in Computer Science</h4>
                                  <p className="text-[10px] font-medium text-purple-600 dark:text-purple-400">MIT</p>
                                </div>
                                <span className="text-[9px] text-gray-500 dark:text-gray-400">2010 - 2014</span>
                              </div>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400">GPA: 3.8/4.0 • Dean's List</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Projects */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                        >
                          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-2 uppercase tracking-wider">Notable Projects</h3>
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">E-Commerce Platform Redesign</h4>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                Led complete redesign of e-commerce platform, resulting in 45% increase in conversion rate and 30% reduction in cart abandonment.
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">Real-time Analytics Dashboard</h4>
                              <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                Built real-time analytics dashboard processing 1M+ events per day with sub-second latency using React and WebSockets.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </ContainerScroll>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  },
)
HeroSection.displayName = "HeroSection"

export { HeroSection }
