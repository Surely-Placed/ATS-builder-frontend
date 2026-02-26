import { Card } from "@/components/ui/card";
import { FileCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ATSOptimizationCardProps {
  variants?: any;
}

export const ATSOptimizationCard = ({ variants }: ATSOptimizationCardProps) => {
  return (
    <motion.div variants={variants} className="md:row-span-3">
      <Card className="p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">ATS Optimization</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Set your resume details in your profile once, then paste any job. Our AI tailors your
            summary, experience, and skills to the role and gives you an optimized PDF.
          </p>
          <div className="space-y-4 flex-1">
            {[
              {
                step: "1",
                title: "Profile Resume Details",
                desc: "Add experience, skills, projects, and education in your profile. No file upload—structured data only.",
              },
              {
                step: "2",
                title: "Paste Job Title & Description",
                desc: "Paste the full job posting. We use it to tailor your content and check ATS fit.",
              },
              {
                step: "3",
                title: "AI Improves Your Content",
                desc: "Get an improved summary, experience bullets, and skills aligned to the job. ATS-friendly structure.",
              },
              {
                step: "4",
                title: "PDF Optimization",
                desc: "Generate your optimized resume PDF before you apply. Download and go.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-primary">{item.step}</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
