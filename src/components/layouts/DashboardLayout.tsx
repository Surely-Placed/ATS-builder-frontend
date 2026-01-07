import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Menu, FileText, Sparkles, FolderOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { HeaderActions } from "@/components/shared/HeaderActions";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const DashboardLayout = ({ children, activeTab }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const tabs = [
    { id: "Dashboard", label: "Dashboard", path: "/dashboard", icon: FileText },
    { id: "Documents", label: "Documents", path: "/documents", icon: FolderOpen },
    {
      id: "Resume Optimization",
      label: "Resume Optimization",
      path: "/resume-optimization",
      icon: Sparkles,
    },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {activeTab !== "Profile" && (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 sm:h-16 items-center gap-2 sm:gap-4 px-4 sm:px-6">
            {/* Sidebar */}
            <DashboardSidebar
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              onLogout={handleLogoutClick}
              isOpen={isSideSheetOpen}
              onOpenChange={setIsSideSheetOpen}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                  <Menu className="w-5 h-5" />
                </Button>
              }
            />

            {/* Logo/Brand in header */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-base sm:text-lg">AI Resume Genius</span>
            </div>

            <div className="flex-1" />

            {/* Right side actions */}
            <HeaderActions themeToggleVariant="icon" />
          </div>
        </header>
      )}

      <div className="flex flex-1">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardLayout;
