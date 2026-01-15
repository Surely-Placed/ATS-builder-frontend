import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * Legacy route - redirects to /resume-analysis for backward compatibility
 */
export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get("analysisId");

  useEffect(() => {
    // Redirect to the new analysis route
    if (analysisId) {
      navigate(`/resume-analysis?analysisId=${analysisId}`, { replace: true });
    } else {
      navigate("/resume-analysis", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId]);

  return null; // Component will redirect immediately
}
