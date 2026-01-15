import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "framer-motion";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";

const testimonials = [
  {
    text: "Jobrabbit helped me land my dream job at Google! The ATS optimization was spot-on, and I got 3x more interview calls.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Johnson",
    role: "Software Engineer at Google",
  },
  {
    text: "The job scraping feature saved me hours of manual work. Just paste the URL, and it optimizes my resume perfectly for each application.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Michael Chen",
    role: "Product Manager at Meta",
  },
  {
    text: "I was skeptical at first, but the AI really understands what recruiters look for. My resume now passes every ATS system.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emily Rodriguez",
    role: "Data Scientist at Amazon",
  },
  {
    text: "From 0 to 5 interviews in just one week! The keyword matching is incredible. Best investment for my job search.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "James Wilson",
    role: "UX Designer at Apple",
  },
  {
    text: "As a career switcher, I needed my resume to stand out. Jobrabbit transformed it into an ATS-friendly masterpiece.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Priya Patel",
    role: "Marketing Manager at Netflix",
  },
  {
    text: "The instant optimization feature is a game-changer. No more guessing if my resume will get through the screening.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Lisa Anderson",
    role: "HR Director at Microsoft",
  },
  {
    text: "I landed interviews at 5 Fortune 500 companies in 2 weeks. The difference was night and day after using Jobrabbit.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "David Kim",
    role: "Sales Director at Salesforce",
  },
  {
    text: "The AI caught formatting issues I didn't even know existed. My resume now looks professional and passes all ATS filters.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Amanda Thompson",
    role: "Business Analyst at Tesla",
  },
  {
    text: "Worth every penny! Got my resume optimized in seconds and started getting responses within days. Highly recommend!",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Ryan Martinez",
    role: "DevOps Engineer at Adobe",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg text-sm font-semibold">Testimonials</div>
          </div>

          <SpotlightHeading className="w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-center flex flex-wrap justify-center">
              {"What our users say".split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.25, 0.4, 0.25, 1],
                  }}
                  className={index === 3 ? "text-gradient mr-2" : "mr-2"}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </SpotlightHeading>
          <p className="text-center mt-5 opacity-75">
            Join thousands of job seekers who landed their dream roles with Jobrabbit.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
