import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/config/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const mode = searchParams.get("mode");
      const oobCode = searchParams.get("oobCode");

      // Check if this is an email verification link
      if (mode !== "verifyEmail" || !oobCode) {
        setStatus("error");
        setMessage("Invalid verification link. Please check your email and try again.");
        return;
      }

      try {
        // Apply the verification code
        await applyActionCode(auth, oobCode);
        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error: any) {
        let errorMessage = "Verification failed. ";

        switch (error.code) {
          case "auth/expired-action-code":
            errorMessage += "This verification link has expired. Please request a new one.";
            break;
          case "auth/invalid-action-code":
            errorMessage += "This verification link is invalid or has already been used.";
            break;
          case "auth/user-disabled":
            errorMessage += "This account has been disabled.";
            break;
          case "auth/user-not-found":
            errorMessage += "No account found with this email.";
            break;
          default:
            errorMessage += error.message || "Please try again or contact support.";
        }

        setStatus("error");
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-4">
            {status === "verifying" && (
              <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="h-16 w-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === "error" && (
              <div className="h-16 w-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "verifying" && "Verifying Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {status === "success" && (
            <>
              <Button onClick={handleGoToLogin} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Go to Login
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Redirecting automatically in 3 seconds...
              </p>
            </>
          )}
          {status === "error" && (
            <div className="space-y-2">
              <Button onClick={handleGoToLogin} className="w-full">
                Try Login Anyway
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="w-full">
                Go to Home
              </Button>
            </div>
          )}
          {status === "verifying" && (
            <div className="text-center text-sm text-muted-foreground">
              Please wait while we verify your email address...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
