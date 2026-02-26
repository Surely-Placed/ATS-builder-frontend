import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function MeetingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  const handleContinue = () => {
    if (sessionId) {
      navigate(`/meeting?session_id=${encodeURIComponent(sessionId)}`, { replace: true });
    } else {
      navigate("/meeting", { replace: true });
    }
  };

  return (
    <DashboardLayout activeTab="Profile">
      <div className="flex items-center justify-center min-h-[70vh] p-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Payment received</h1>
          <p className="text-muted-foreground">
            Your reservation is confirmed. Click below to pick your time and complete your booking.
          </p>
          <Button className="mt-4" onClick={handleContinue}>
            Continue to pick time
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
