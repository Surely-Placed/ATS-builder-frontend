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
            Paste your job description, title, upload your resume, and let our AI do the rest. We
            automatically tailor your resume to match the job requirements with ATS-friendly
            formatting.
          </p>
          <div className="space-y-4 flex-1">
            {[
              {
                step: "1",
                title: "Paste Job Description",
                desc: "Paste the job description and we extract all key requirements, skills, and keywords from the job posting.",
              },
              {
                step: "2",
                title: "Analyze Your Resume",
                desc: "Our AI scans your uploaded resume for compatibility issues, missing keywords, and formatting errors.",
              },
              {
                step: "3",
                title: "Auto-Update PDF",
                desc: "Automatically applies ATS-friendly fixes, optimizes formatting, and enhances content to match the job description.",
              },
              {
                step: "4",
                title: "Download & Apply",
                desc: "Get your perfectly optimized, ATS-friendly resume ready to submit. No manual editing required.",
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
