import { Link } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";
import { ArrowLeft } from "lucide-react";

export function MeetingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex items-center h-12 sm:h-14 px-3 sm:px-4 md:px-6 gap-2 min-w-0">
        <Link
          to="/"
          className="flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0 h-8 w-8"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Logo showText={true} size="sm" className="shrink-0 min-w-0" />
      </div>
    </header>
  );
}
