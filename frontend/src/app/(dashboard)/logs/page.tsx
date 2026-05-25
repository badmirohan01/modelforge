"use client";

import { useState } from "react";
import { useModels } from "@/hooks/useModels";
import { useLogs } from "@/hooks/useLogs";
import { LogsTable } from "@/components/dashboard/logs-table";
import { AlertCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Inner component that renders logs for a specific model
function ModelLogs({ modelId }: { modelId: string }) {
  const [page, setPage] = useState(0);
  const { data: logs, isLoading } = useLogs(modelId, page, 20);

  return (
    <LogsTable
      logs={logs}
      isLoading={isLoading}
      page={page}
      onPageChange={setPage}
    />
  );
}

export default function LogsPage() {
  const { data: models, isLoading: isModelsLoading, error } = useModels();
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Failed to load inference logs
          </h2>
          <p className="text-zinc-400 mt-1">
            {error.message || "Please check your connection and try again."}
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

  // Auto-select first model if none selected
  if (models && models.length > 0 && !selectedModelId) {
    setSelectedModelId(models[0].id);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <History className="w-8 h-8 text-zinc-400" />
            Inference Logs
          </h1>
          <p className="text-zinc-400 mt-2">
            View a detailed history of all inference requests made to your
            models, including status, latency, and error details.
          </p>
        </div>
      </div>

      {/* Model Selector */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-white text-lg">Select Model</CardTitle>
          <CardDescription className="text-zinc-400">
            Choose a model to view its inference history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isModelsLoading ? (
            <Skeleton className="h-10 w-full max-w-md bg-zinc-800" />
          ) : !models || models.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              No models deployed yet. Deploy a model first to see logs.
            </p>
          ) : (
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white w-full max-w-md focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} (v{model.latestVersion})
                </option>
              ))}
            </select>
          )}
        </CardContent>
      </Card>

      {/* Logs for Selected Model */}
      {selectedModelId && <ModelLogs modelId={selectedModelId} />}
    </div>
  );
}
