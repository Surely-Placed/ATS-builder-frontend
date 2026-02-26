import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileResumeDetailsForm } from "@/features/profile/components/ProfileResumeDetailsForm";
import { Button } from "@/components/ui/button";

export default function Resume() {
  const navigate = useNavigate();

  return (
    <DashboardLayout activeTab="Resume">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">Resume details</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Add your professional info, experience, skills, and projects. Required fields must be filled before you can run analysis.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Set up your resume details
            </CardTitle>
            <CardDescription>
              Fill in the required fields (name, email, and at least one experience). You can update these anytime from Profile → Resume.
            </CardDescription>
          </CardHeader>
        </Card>

        <ProfileResumeDetailsForm
          onSaveSuccess={() => {
            navigate("/resume-analysis");
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next step</CardTitle>
            <CardDescription>
              After saving your resume details, go to Resume Analysis to paste a job description and generate an optimized resume.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button onClick={() => navigate("/resume-analysis")} variant="outline">
              Go to Resume Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
