import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Calendar, Trash2, Upload, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Resume {
  id: string;
  original_file_url: string;
  optimized_file_url: string | null;
  created_at: string;
}

interface ResumeTabProps {
  profileResume: Resume | null;
  uploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: () => Promise<void>;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

export const ResumeTab = ({
  profileResume,
  uploading,
  onFileSelect,
  onRemove,
  fileInputRef,
}: ResumeTabProps) => {
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = fileInputRef || internalFileInputRef;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleConfirmDelete = async () => {
    setShowDeleteDialog(false);
    await onRemove();
  };

  return (
    <div className="space-y-6 pl-0 pr-0">
      {profileResume ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <p className="font-semibold">Profile Resume</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(profileResume.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setShowDeleteDialog(true)} 
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Replace Profile Resume</h3>
              </div>
              <div className="space-y-3">
                <Input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileSelect}
                  disabled={uploading}
                  className="cursor-pointer h-11"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardContent className="p-6">
            <div className="text-center py-12 space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Profile Resume</h3>
                <p className="text-muted-foreground mb-6">
                  Upload a resume to save it to your profile for quick access!
                </p>
              </div>
              <div className="space-y-3 max-w-md mx-auto">
                <Input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileSelect}
                  disabled={uploading}
                  className="cursor-pointer h-11"
                />
                {uploading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Profile Resume?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this resume from your profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Resume
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
