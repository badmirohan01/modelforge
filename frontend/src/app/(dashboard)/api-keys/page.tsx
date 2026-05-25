"use client";

import { useModels } from "@/hooks/useModels";
import { useApiKeys } from "@/hooks/useApiKeys";
import { ApiKeyCard } from "@/components/dashboard/api-key-card";
import { AlertCircle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApiKeysPage() {
  const { data: models, isLoading: isModelsLoading } = useModels();
  const { keys, isKeysLoading, keysError, generateKey, revokeKey, deleteKey, updateKey } = useApiKeys();

  if (keysError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Failed to load API keys
          </h2>
          <p className="text-zinc-400 mt-1">
            {keysError.message || "Please check your connection and try again."}
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 border-zinc-800 text-zinc-300"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Key className="w-8 h-8 text-zinc-400" />
            API Keys
          </h1>
          <p className="text-zinc-400 mt-2">
            Manage your API keys. You can create keys for all models or limit them to specific ones.
          </p>
        </div>
      </div>

      {isKeysLoading || isModelsLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full bg-zinc-800/50 rounded-xl" />
        </div>
      ) : (
        <ApiKeyCard
          keys={keys}
          models={models}
          isLoading={isKeysLoading}
          onGenerate={(label, isGlobal, modelIds) => generateKey.mutateAsync({ label, isGlobal, modelIds })}
          onRevoke={(id) => revokeKey.mutate(id)}
          onDelete={(id) => deleteKey.mutate(id)}
          onUpdate={(id, label) => updateKey.mutate({ keyId: id, label })}
          isGenerating={generateKey.isPending}
        />
      )}
    </div>
  );
}
