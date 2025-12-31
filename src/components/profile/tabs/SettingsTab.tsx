import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, Monitor, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Preferences {
  notifications: {
    email_analyses?: boolean;
    email_optimizations?: boolean;
    email_subscription?: boolean;
    email_marketing?: boolean;
  };
  display: {
    theme?: string;
    language?: string;
    date_format?: string;
  };
  analysis: {
    default_job_title?: string;
    preferred_format?: string;
    auto_optimize?: boolean;
  };
}

interface SettingsTabProps {
  preferences: Preferences | null;
  onUpdate: (prefData: Partial<Preferences>) => Promise<void>;
}

export const SettingsTab = ({ preferences, onUpdate }: SettingsTabProps) => {
  if (!preferences) {
    return (
      <div className="space-y-6 pl-0 pr-0">
        <Card className="border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading preferences...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    const newPrefs = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    };
    onUpdate({ notifications: newPrefs.notifications });
  };

  const handleDisplayChange = (key: string, value: string) => {
    const newPrefs = {
      ...preferences,
      display: { ...preferences.display, [key]: value },
    };
    onUpdate({ display: newPrefs.display });
  };

  const handleAnalysisChange = (key: string, value: string | boolean) => {
    const newPrefs = {
      ...preferences,
      analysis: { ...preferences.analysis, [key]: value },
    };
    onUpdate({ analysis: newPrefs.analysis });
  };

  return (
    <div className="space-y-6 pl-0 pr-0">
      {/* Notification Preferences */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email_analyses', label: 'Analysis completed' },
            { key: 'email_optimizations', label: 'Optimization completed' },
            { key: 'email_subscription', label: 'Subscription updates' },
            { key: 'email_marketing', label: 'Marketing emails' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <Label className="text-sm">{item.label}</Label>
              <Switch
                checked={preferences.notifications[item.key as keyof typeof preferences.notifications] || false}
                onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Select
              value={preferences.display.date_format || 'MM/DD/YYYY'}
              onValueChange={(value) => handleDisplayChange('date_format', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Preferences */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Analysis Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Format</Label>
            <Select
              value={preferences.analysis.preferred_format || 'pdf'}
              onValueChange={(value) => handleAnalysisChange('preferred_format', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Auto-optimize after analysis</Label>
            <Switch
              checked={preferences.analysis.auto_optimize || false}
              onCheckedChange={(checked) => handleAnalysisChange('auto_optimize', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

