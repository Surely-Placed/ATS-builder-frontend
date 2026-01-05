import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBgColor: string;
  iconColor: string;
}

export const StatCard = ({ icon: Icon, label, value, iconBgColor, iconColor }: StatCardProps) => {
  return (
    <Card className="border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <CardContent className="p-6">
        <div className={`w-10 h-10 rounded-[10px] ${iconBgColor} flex items-center justify-center mb-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="text-sm font-medium text-muted-foreground mb-2">{label}</div>
        <div className="text-3xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
};

