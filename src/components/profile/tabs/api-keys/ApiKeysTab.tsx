import { useApiKeys } from '@/hooks/profile/api-keys';
import { NewKeyAlert } from './NewKeyAlert';
import { CreateKeyForm } from './CreateKeyForm';
import { ApiKeyList } from './ApiKeyList';
import { InfoCard } from './InfoCard';
import { RevokeDialog } from './RevokeDialog';
import { ReleaseDialog } from './ReleaseDialog';
import { formatDateApiKeys } from '@/utils/profile/dateUtils';

export const ApiKeysTab = () => {
  const {
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
  } = useApiKeys();

  return (
    <div className="space-y-6 pl-0 pr-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Extension API Keys</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate API keys to use with the Chrome/Edge extension. Each key can only be used on one device at a time.
        </p>
      </div>

      {/* New Key Display */}
      {newKey && <NewKeyAlert newKey={newKey} onCopy={copyToClipboard} />}

      {/* Create New Key Form */}
      <CreateKeyForm
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        creating={creating}
        onSubmit={handleCreateKey}
      />

      {/* API Keys List */}
      <ApiKeyList
        apiKeys={apiKeys}
        loading={loading}
        actionLoading={actionLoading}
        onOpenReleaseDialog={(keyId) => setReleaseDialogOpen(keyId)}
        onOpenRevokeDialog={(keyId) => setRevokeDialogOpen(keyId)}
        formatDate={formatDateApiKeys}
      />

      {/* Info Box */}
      <InfoCard />

      {/* Dialogs */}
      <RevokeDialog
        open={!!revokeDialogOpen}
        onOpenChange={(open) => !open && setRevokeDialogOpen(null)}
        onConfirm={() => revokeDialogOpen && handleRevokeKey(revokeDialogOpen)}
      />
      <ReleaseDialog
        open={!!releaseDialogOpen}
        onOpenChange={(open) => !open && setReleaseDialogOpen(null)}
        onConfirm={() => releaseDialogOpen && handleReleaseDevice(releaseDialogOpen)}
      />
    </div>
  );
};

