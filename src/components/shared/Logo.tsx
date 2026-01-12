import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4 sm:w-5 sm:h-5",
    lg: "w-5 h-5 sm:w-6 sm:h-6",
  };

  const textSizes = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg lg:text-xl",
    lg: "text-lg sm:text-xl lg:text-2xl",
  };

  return (
    <Link to="/" className={`flex items-center gap-1.5 sm:gap-2 group min-w-0 ${className}`}>
      <div
        className={`relative p-1.5 sm:p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors flex-shrink-0`}
      >
        <FileText className={`${iconSizes[size]} text-primary`} />
        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-foreground whitespace-nowrap`}>
          Jobrabbit<span className="text-primary">.AI</span>
        </span>
      )}
    </Link>
  );
};
