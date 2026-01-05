import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

interface HeaderActionsProps {
  showThemeToggle?: boolean;
  showProfileDropdown?: boolean;
  themeToggleVariant?: "icon" | "toggle";
  className?: string;
}

export const HeaderActions = ({
  showThemeToggle = true,
  showProfileDropdown = true,
  themeToggleVariant = "toggle",
  className = ""
}: HeaderActionsProps) => {
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0 ${className}`}>
      {/* Theme Toggle - Desktop only (mobile shown in ProfileDropdown) */}
      {showThemeToggle && mounted && (
        <>
          {themeToggleVariant === "toggle" ? (
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="h-8 w-8 sm:h-10 sm:w-10 hidden md:flex"
              title={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          )}
        </>
      )}
      {/* Profile Dropdown */}
      {showProfileDropdown && user && (
        <div className="flex-shrink-0">
          <ProfileDropdown />
        </div>
      )}
    </div>
  );
};




