"use client";

import { use } from "react";
import { useModelDetail } from "@/hooks/useModelDetail";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Box, LayoutGrid, Terminal } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { InferenceConsole } from "@/components/dashboard/inference-console";
import { ApiKeyCard } from "@/components/dashboard/api-key-card";
import { LogsTable } from "@/components/dashboard/logs-table";

interface ModelDetailPageProps {
  params: Promise<{ modelId: string }>;
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  // Extract modelId from promise using React 19's `use` hook
  const { modelId } = use(params);

  const {
    model,
    isModelLoading,
    keys,
    isKeysLoading,
    logs,
    isLogsLoading,
    logsPage,
    setLogsPage,
    infer,
    generateKey,
    revokeKey,
  } = useModelDetail(modelId);

  if (isModelLoading || !model) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg bg-zinc-800" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-zinc-800" />
            <Skeleton className="h-4 w-32 bg-zinc-800" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl bg-zinc-800/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-col gap-2">
          <Link
            href="/models"
            className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors w-fit"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Models
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg shrink-0">
              <Box className="w-6 h-6 text-zinc-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                {model.name}
                <Badge variant="outline" className="text-xs bg-zinc-900 border-zinc-700 font-mono text-zinc-400">
                  v{model.latestVersion}
                </Badge>
                {model.isPublic && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                    Public
                  </Badge>
                )}
              </h1>
              <p className="text-zinc-400 mt-1">{model.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end text-sm text-zinc-500">
          <span>Created on {format(new Date(model.createdAt), "MMM d, yyyy")}</span>
          <span className="font-mono text-xs mt-1">ID: mf_...{model.id.substring(0, 8)}</span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-zinc-950/40 border border-zinc-800/60 w-full sm:w-auto p-1.5 h-12 gap-2 backdrop-blur-md rounded-full shadow-2xl">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-zinc-800/80 data-[state=active]:text-white data-[state=active]:shadow-lg text-zinc-500 h-full px-10 rounded-full transition-all duration-300 font-semibold text-[11px] uppercase tracking-[0.2em] border-none ring-0 focus:ring-0 focus-visible:ring-0"
          >
            <LayoutGrid className="w-4 h-4 mr-2.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="data-[state=active]:bg-zinc-800/80 data-[state=active]:text-white data-[state=active]:shadow-lg text-zinc-500 h-full px-10 rounded-full transition-all duration-300 font-semibold text-[11px] uppercase tracking-[0.2em] border-none ring-0 focus:ring-0 focus-visible:ring-0"
          >
            <Terminal className="w-4 h-4 mr-2.5" />
            Logs & Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Inference Console on the left */}
            <InferenceConsole
              onInfer={(inputs) => infer.mutate({ inputs, proba: true })}
              isPending={infer.isPending}
              result={infer.data}
            />

            {/* API Keys on the right */}
            <ApiKeyCard
              keys={keys}
              isLoading={isKeysLoading}
              onGenerate={(label) => generateKey.mutateAsync(label)}
              onRevoke={(id) => revokeKey.mutate(id)}
              onUpdate={(id, label) => updateKey.mutate({ keyId: id, label })}
              isGenerating={generateKey.isPending}
            />
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <LogsTable
            logs={logs}
            isLoading={isLogsLoading}
            page={logsPage}
            onPageChange={setLogsPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
