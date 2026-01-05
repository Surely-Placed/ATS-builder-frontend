import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, KeyRound, Loader2 } from 'lucide-react';

interface CreateKeyFormProps {
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  creating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateKeyForm = ({
  newKeyName,
  setNewKeyName,
  creating,
  onSubmit,
}: CreateKeyFormProps) => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          Generate New API Key
        </CardTitle>
        <CardDescription>
          Create a new API key for your browser extension
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyName">Key Name (optional)</Label>
            <Input
              id="keyName"
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Chrome Extension, Work Laptop"
              disabled={creating}
            />
          </div>
          <Button type="submit" disabled={creating} className="w-full" size="lg">
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Generate API Key
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

