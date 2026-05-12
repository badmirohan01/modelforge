"use client";

import { useModels } from "@/hooks/useModels";
import { UploadModal } from "@/components/dashboard/upload-model";
import { ModelCard } from "@/components/dashboard/model-card";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ModelsPage() {
  const { data: models, isLoading, error } = useModels();
  const [searchQuery, setSearchQuery] = useState("");

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Failed to load models</h2>
          <p className="text-zinc-400 mt-1">{error.message || "Please check your connection and try again."}</p>
        </div>
        <Button variant="outline" className="mt-4 border-zinc-800 text-zinc-300" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const filteredModels = models?.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (model.description && model.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Models</h1>
          <p className="text-zinc-400">Deploy and manage your machine learning models.</p>
        </div>
        <UploadModal />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Search models by name or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 focus:border-zinc-600 focus:ring-0"
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-xl animate-pulse flex flex-col p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800"></div>
                <div className="w-16 h-5 rounded-full bg-zinc-800"></div>
              </div>
              <div className="w-3/4 h-6 rounded bg-zinc-800 mb-2"></div>
              <div className="w-full h-4 rounded bg-zinc-800 mb-1"></div>
              <div className="w-5/6 h-4 rounded bg-zinc-800 mb-6"></div>
              
              <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
                <div className="h-4 rounded bg-zinc-800"></div>
                <div className="h-4 rounded bg-zinc-800"></div>
              </div>
              <div className="w-full h-10 rounded-md bg-zinc-800 mt-2"></div>
            </div>
          ))}
        </div>
      ) : !models || models.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-zinc-800 rounded-lg">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No models found</h3>
          <p className="text-zinc-400 mb-6 max-w-sm">You haven't deployed any models yet. Upload your first .pkl file to get started.</p>
          <UploadModal />
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border border-dashed border-zinc-800 rounded-lg">
          <p className="text-zinc-500">No models match your search query.</p>
          <Button variant="link" className="text-primary mt-2" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}
