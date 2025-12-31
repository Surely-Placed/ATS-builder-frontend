import { ReactNode, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface NavItem {
  name: string;
  url: string;
  icon: ReactNode;
}

interface MobileNavMenuProps {
  items: NavItem[];
  onItemClick?: (url: string) => void;
  trigger?: ReactNode;
  side?: "left" | "right";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const MobileNavMenu = ({
  items,
  onItemClick,
  trigger,
  side = "right",
  className = "",
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: MobileNavMenuProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const handleClick = (url: string) => {
    setOpen(false);
    if (onItemClick) {
      onItemClick(url);
    } else {
      window.location.href = url;
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
      <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className={className}>
        {trigger || defaultTrigger}
      </SheetTrigger>
      <SheetContent side={side} className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          {items.map((item) => (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.url);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              {item.icon}
              <span className="text-base font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

