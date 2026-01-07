import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  variants?: any;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  children,
  className = "",
  variants,
}: FeatureCardProps) => {
  return (
    <motion.div variants={variants} className={className}>
      <Card className="p-6 h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {children}
      </Card>
    </motion.div>
  );
};
