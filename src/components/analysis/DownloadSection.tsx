import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Loader2 } from "lucide-react";
import { OptimizationResult } from "@/services/analysisApi";

interface DownloadSectionProps {
  onDownload: () => void;
  onStartNew: () => void;
  onPreview?: () => void;
  isPreviewLoading?: boolean;
  isDownloadLoading?: boolean;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({
  onDownload,
  onStartNew,
  onPreview,
  isPreviewLoading = false,
  isDownloadLoading = false,
}) => {
  return (
    <Card className="download-section">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {onPreview && (
              <Button
                onClick={onPreview}
                size="lg"
                variant="outline"
                className="btn-preview"
                disabled={isPreviewLoading}
              >
                {isPreviewLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading Preview...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Preview Changes
                  </>
                )}
              </Button>
            )}
            <Button
              onClick={onDownload}
              size="lg"
              className="btn-download"
              disabled={isDownloadLoading}
            >
              {isDownloadLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Optimized Resume PDF
                </>
              )}
            </Button>
          </div>
          <p className="download-note">
            Your optimized resume is ready! Preview the changes or download the PDF for your job
            applications.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};