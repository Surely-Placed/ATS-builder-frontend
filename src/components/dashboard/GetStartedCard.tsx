import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const GetStartedCard = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              Ready to optimize your resume?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Upload your resume and job posting to get AI-powered insights and recommendations
            </p>
          </div>
          <button
            onClick={() => navigate("/resume-optimization")}
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg text-sm sm:text-base font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            Get Started
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
