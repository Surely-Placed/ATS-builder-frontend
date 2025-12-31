import { useState } from "react";
import { BarChart3, User, FileText, CreditCard, ShoppingCart, Activity, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

interface ProfileSidebarProps {
  activeTab?: string; // Optional, will be derived from URL
  onTabChange?: (tabId: string) => void; // Optional, will use navigation
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" />, section: 'MENU' },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, section: 'MENU' },
  { id: 'resume', label: 'Resume', icon: <FileText className="w-5 h-5" />, section: 'MENU' },
  { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" />, section: 'MENU' },
  { id: 'purchases', label: 'Purchase History', icon: <ShoppingCart className="w-5 h-5" />, section: 'MENU' },
  { id: 'activity', label: 'Activity', icon: <Activity className="w-5 h-5" />, section: 'MENU' },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, section: 'GENERAL' },
];

export const ProfileSidebar = ({ activeTab, onTabChange }: ProfileSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuTabs = tabs.filter(tab => tab.section === 'MENU');
  const generalTabs = tabs.filter(tab => tab.section === 'GENERAL');

  // Get active tab from URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path === '/profile' || path === '/profile/') {
      return 'overview';
    }
    const section = path.split('/profile/')[1];
    return section || 'overview';
  };
  
  const currentActiveTab = getActiveTabFromPath();

  const handleTabChange = (tabId: string) => {
    navigate(`/profile/${tabId}`);
    if (onTabChange) {
      onTabChange(tabId);
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-lg hover:bg-muted shadow-sm bg-background border"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-background">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* MENU Section */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                MENU
              </h3>
              <nav className="space-y-1">
                {menuTabs.map((tab) => (
                  <Link
                    key={tab.id}
                    to={`/profile/${tab.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group",
                      currentActiveTab === tab.id
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {currentActiveTab === tab.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                    )}
                    <span className={cn(
                      "flex-shrink-0",
                      currentActiveTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {tab.icon}
                    </span>
                    <span className="flex-1 text-left">{tab.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* GENERAL Section */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                GENERAL
              </h3>
              <nav className="space-y-1">
                {generalTabs.map((tab) => (
                  <Link
                    key={tab.id}
                    to={`/profile/${tab.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group",
                      currentActiveTab === tab.id
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    {currentActiveTab === tab.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                    )}
                    <span className={cn(
                      "flex-shrink-0",
                      currentActiveTab === tab.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {tab.icon}
                    </span>
                    <span className="flex-1 text-left">{tab.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

