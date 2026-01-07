import { Home, Sparkles, DollarSign, Phone, Menu, X, Sun, Moon } from "lucide-react";
import { MenuItem } from "@/components/ui/fluid-menu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface NavItem {
  name: string;
  url: string;
  icon: typeof Home;
}

interface FluidMenuItemsProps {
  items: NavItem[];
  onItemClick: (url: string) => void;
  mounted: boolean;
  onMenuClose?: () => void;
  onToggle?: () => void;
}

export const FluidMenuItems = ({
  items,
  onItemClick,
  mounted,
  onMenuClose,
  onToggle,
}: FluidMenuItemsProps) => {
  const { resolvedTheme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const iconMap: Record<string, typeof Home> = {
    Home,
    Features: Sparkles,
    Pricing: DollarSign,
    Contact: Phone,
  };

  return (
    <>
      <MenuItem
        icon={
          <div className="relative w-5 h-5">
            <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-100 scale-100 rotate-0 [div[data-expanded=true]_&]:opacity-0 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:rotate-180">
              <Menu size={20} strokeWidth={2} className="text-primary-foreground" />
            </div>
            <div className="absolute inset-0 transition-all duration-300 ease-in-out origin-center opacity-0 scale-0 -rotate-180 [div[data-expanded=true]_&]:opacity-100 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:rotate-0">
              <X size={20} strokeWidth={2} className="text-primary-foreground" />
            </div>
          </div>
        }
        onClick={() => {
          onToggle?.();
        }}
      />
      {items.map((item) => {
        const Icon = iconMap[item.name] || Home;
        return (
          <MenuItem
            key={item.name}
            icon={
              <div className="group/item relative">
                <Icon size={20} strokeWidth={2} className="text-foreground" />
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none">
                  {item.name}
                </div>
              </div>
            }
            onClick={() => {
              // Close menu first, then navigate
              if (onMenuClose) {
                onMenuClose();
              }
              // Small delay to ensure menu closes before navigation
              setTimeout(() => {
                onItemClick(item.url);
              }, 50);
            }}
          />
        );
      })}
      {mounted && (
        <MenuItem
          icon={
            <div className="group/item relative">
              {resolvedTheme === "dark" ? (
                <Sun size={20} strokeWidth={2} className="text-foreground" />
              ) : (
                <Moon size={20} strokeWidth={2} className="text-foreground" />
              )}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 pointer-events-none">
                Theme
              </div>
            </div>
          }
          onClick={handleThemeToggle}
        />
      )}
    </>
  );
};
