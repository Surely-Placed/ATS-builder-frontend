import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Copy } from "lucide-react";

interface NewKeyAlertProps {
  newKey: string;
  onCopy: (text: string) => void;
}

export const NewKeyAlert = ({ newKey, onCopy }: NewKeyAlertProps) => {
  return (
    <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertTitle className="text-yellow-900 dark:text-yellow-100">
         Save This API Key Now!
      </AlertTitle>
      <AlertDescription className="text-yellow-800 dark:text-yellow-200 mt-2">
        <p className="mb-4">
          This is the only time you'll see this key. Copy it and enter it in your browser extension.
        </p>
        <div className="flex items-center gap-3">
          <code className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border-2 border-yellow-400 rounded-lg text-2xl font-mono font-bold text-center tracking-widest text-foreground">
            {newKey}
          </code>
          <Button
            onClick={() => onCopy(newKey)}
            variant="default"
            size="lg"
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <p className="text-sm mt-3">
          Enter this 6-character code in your browser extension to authenticate.
        </p>
      </AlertDescription>
    </Alert>
  );
};
