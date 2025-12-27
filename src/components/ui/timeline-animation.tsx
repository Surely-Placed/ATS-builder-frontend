import { motion, MotionProps } from "framer-motion";
import { useEffect, useState, RefObject } from "react";
import { cn } from "@/lib/utils";

interface TimelineContentProps extends MotionProps {
  children: React.ReactNode;
  animationNum: number;
  timelineRef: RefObject<HTMLElement>;
  customVariants?: any;
  className?: string;
  as?: keyof typeof motion;
}

export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  customVariants,
  className,
  as = "div",
  ...props
}: TimelineContentProps) {
  const [isInView, setIsInView] = useState(false);
  const Component = motion[as] as any;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, [timelineRef]);

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  const variants = customVariants || defaultVariants;

  return (
    <Component
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
