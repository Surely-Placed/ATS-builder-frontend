import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export const InfoCard = () => {
  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Info className="h-5 w-5" />
          How It Works
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Generate a 6-character API key and enter it in your browser extension</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Each API key can only be used on one device at a time</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>
              To use the same key on another device, release it from the current device first
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>You can revoke keys at any time to immediately stop access</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
