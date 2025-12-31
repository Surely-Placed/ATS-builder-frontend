import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { FileText, LogOut, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarThemeToggle } from "./SidebarThemeToggle";

interface Tab {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (path: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
}

export const DashboardSidebar = ({
  tabs,
  activeTab,
  onTabClick,
  onLogout,
  isOpen,
  onOpenChange,
  trigger
}: DashboardSidebarProps) => {
  const navigate = useNavigate();

  const handleTabClick = (path: string) => {
    onTabClick(path);
    onOpenChange(false);
  };

  const handleLogout = () => {
    onOpenChange(false);
    onLogout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col gap-6 pt-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 pb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">AI Resume Genius</span>
          </div>

          <Separator />

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => handleTabClick(tab.path)}
                className="justify-start gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </nav>

          <Separator />

          {/* Theme Toggle */}
          <SidebarThemeToggle />

          {/* Logout */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="justify-start gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

