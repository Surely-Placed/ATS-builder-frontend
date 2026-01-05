import { useState, useEffect } from 'react';
import { apiKeysService, type ApiKey } from '@/services/apiKeysService';
import { useToast } from '@/hooks/use-toast';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('Chrome Extension');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState<string | null>(null);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      const response = await apiKeysService.getApiKeys();
      if (response.success) {
        setApiKeys(response.data);
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setNewKey(null);

      const response = await apiKeysService.createApiKey(newKeyName);
      if (response.success) {
        setNewKey(response.data.key);
        toast({
          title: 'Success',
          description: 'API key created successfully! Copy it now - it will not be shown again.',
        });
        await loadApiKeys();
        setNewKeyName('Chrome Extension');
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleReleaseDevice = async (keyId: string) => {
    try {
      setActionLoading(keyId);
      const response = await apiKeysService.releaseDevice(keyId);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Device released successfully. You can now use this API key on another device.',
        });
        await loadApiKeys();
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to release device',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
      setReleaseDialogOpen(null);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    try {
      setActionLoading(keyId);
      const response = await apiKeysService.revokeApiKey(keyId);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'API key revoked successfully.',
        });
        await loadApiKeys();
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to revoke API key',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
      setRevokeDialogOpen(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard',
    });
  };

  return {
    apiKeys,
    loading,
    creating,
    newKey,
    newKeyName,
    setNewKeyName,
    actionLoading,
    revokeDialogOpen,
    setRevokeDialogOpen,
    releaseDialogOpen,
    setReleaseDialogOpen,
    handleCreateKey,
    handleReleaseDevice,
    handleRevokeKey,
    copyToClipboard,
  };
};

