"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2, Key as KeyIcon, Check, Loader2 } from "lucide-react";
import { ApiKeyResponse } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ApiKeyCardProps {
  keys: ApiKeyResponse[] | undefined;
  isLoading: boolean;
  onGenerate: (label: string) => void;
  onRevoke: (id: string) => void;
  isGenerating: boolean;
}

export function ApiKeyCard({ keys, isLoading, onGenerate, onRevoke, isGenerating }: ApiKeyCardProps) {
  const [newLabel, setNewLabel] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = () => {
    if (!newLabel.trim()) return;
    onGenerate(newLabel);
    setNewLabel("");
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 h-full flex flex-col shadow-2xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <KeyIcon className="w-5 h-5 text-zinc-400" />
          API Keys
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Manage API keys for this specific model. These keys authenticate inference requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input 
              placeholder="e.g. Production Key" 
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="bg-zinc-950/50 border-zinc-800 text-white focus:border-zinc-600 focus:ring-0 h-11 pl-4"
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={!newLabel.trim() || isGenerating}
            className="bg-white text-black hover:bg-zinc-200 h-11 px-6 font-medium shrink-0 shadow-lg shadow-white/5"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Generate Key
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-zinc-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !keys || keys.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
              No API keys generated yet.
            </div>
          ) : (
            keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/30 hover:bg-zinc-900/50 transition-all duration-200 group">
                <div className="flex flex-col gap-1.5 overflow-hidden pr-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-sm text-zinc-100">{key.label}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] uppercase tracking-wider px-1.5 py-0 border-none ${
                        key.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {key.isActive ? "Active" : "Revoked"}
                    </Badge>
                  </div>
                  {key.rawKey ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-xs text-primary font-mono bg-primary/5 px-2.5 py-1 rounded border border-primary/10 truncate max-w-[200px] sm:max-w-md">
                        {key.rawKey}
                      </code>
                      <button 
                        onClick={() => handleCopy(key.rawKey!, key.id)}
                        className="p-1 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                        title="Copy Key"
                      >
                        {copiedId === key.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <KeyIcon className="w-3 h-3 text-zinc-600" />
                      <span>mf_...{key.id.substring(0, 12)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-zinc-600">
                      Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                    </span>
                    {key.lastUsedAt && (
                      <>
                        <span className="text-zinc-800">•</span>
                        <span className="text-[10px] text-zinc-600">
                          Last used {formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRevoke(key.id)}
                  disabled={!key.isActive}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Revoke Key"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
