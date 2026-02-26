import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6 sm:h-7 sm:w-7",
    lg: "h-8 w-8 sm:h-9 sm:w-9",
  };

  const textSizes = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg lg:text-xl",
    lg: "text-lg sm:text-xl lg:text-2xl",
  };

  // Use a single logo asset in all themes for now to avoid
  // mismatches between light/dark SVG exports.
  const baseUrl = import.meta.env.BASE_URL ?? "/";
  const logoSrc = baseUrl + "rabbit-dark.svg";

  return (
    <Link to="/" className={`flex items-center group min-w-0 ${className}`}>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-foreground whitespace-nowrap`}>
          Job
        </span>
      )}
      <img 
        src={logoSrc} 
        alt="Jobrabbit Logo" 
        className={`${logoSizes[size]} mx-0.5`}
      />
      {showText && (
        <span className={`${textSizes[size]} font-bold text-foreground whitespace-nowrap`}>
          rabbit
        </span>
      )}
    </Link>
  );
};
