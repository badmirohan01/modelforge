import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2, Key as KeyIcon, Check, Loader2, AlertCircle, Eye, EyeOff, Pencil, X } from "lucide-react";
import { ApiKeyResponse } from "@/types";
import { formatDistanceToNow, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApiKeyCardProps {
  keys: ApiKeyResponse[] | undefined;
  isLoading: boolean;
  onGenerate: (label: string) => Promise<ApiKeyResponse | void>;
  onRevoke: (id: string) => void;
  onUpdate: (id: string, label: string) => void;
  isGenerating: boolean;
}

export function ApiKeyCard({ keys, isLoading, onGenerate, onRevoke, onUpdate, isGenerating }: ApiKeyCardProps) {
  const [newLabel, setNewLabel] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<ApiKeyResponse | null>(null);
  const [showRawKey, setShowRawKey] = useState(true);
  
  // Renaming state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    if (!newLabel.trim()) return;
    try {
      const result = await onGenerate(newLabel);
      if (result && result.rawKey) {
        setGeneratedKey(result);
        setShowSuccessModal(true);
        setNewLabel("");
      }
    } catch (error) {
      console.error("Failed to generate key", error);
    }
  };

  const startEditing = (key: ApiKeyResponse) => {
    setEditingId(key.id);
    setEditLabel(key.label);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditLabel("");
  };

  const saveEdit = (id: string) => {
    if (!editLabel.trim()) return;
    onUpdate(id, editLabel);
    setEditingId(null);
  };

  return (
    <>
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
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
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
                  <div className="flex flex-col gap-1.5 overflow-hidden pr-4 flex-1">
                    <div className="flex items-center gap-2.5">
                      {editingId === key.id ? (
                        <div className="flex items-center gap-1.5 flex-1 max-w-xs">
                          <Input
                            autoFocus
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(key.id)}
                            className="h-7 text-sm bg-zinc-900 border-zinc-700 text-white py-0 px-2 focus:ring-1 focus:ring-primary/50"
                          />
                          <button onClick={() => saveEdit(key.id)} className="p-1 hover:text-emerald-400 transition-colors">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={cancelEditing} className="p-1 hover:text-red-400 transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-semibold text-sm text-zinc-100">{key.label}</span>
                          <button 
                            onClick={() => startEditing(key)} 
                            className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                            title="Rename Key"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] uppercase tracking-wider px-1.5 py-0 border-none font-bold ${
                              key.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {key.isActive ? "Active" : "Revoked"}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <KeyIcon className="w-3 h-3 text-zinc-600" />
                      <span>mf_...{key.id.substring(0, 12)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span className="text-[10px] text-zinc-600 flex items-center gap-1" title={format(new Date(key.createdAt), "PPP p")}>
                        Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}
                      </span>
                      {key.lastUsedAt && (
                        <>
                          <span className="text-zinc-800 hidden sm:inline">•</span>
                          <span className="text-[10px] text-zinc-600" title={format(new Date(key.lastUsedAt), "PPP p")}>
                            Last used {formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleCopy(`mf_...${key.id.substring(0, 12)}`, key.id)}
                      className="text-zinc-500 hover:text-white hover:bg-zinc-800"
                      title="Copy Key ID"
                    >
                      {copiedId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onRevoke(key.id)}
                      disabled={!key.isActive}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-0"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Modal for New Key */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-400">
              <Check className="w-5 h-5" />
              API Key Generated
            </DialogTitle>
            <DialogDescription className="text-zinc-400 pt-2">
              Please copy your API key now. For security reasons, you won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Key Label</label>
              <div className="relative">
                <div className="absolute -inset-px bg-zinc-800/50 rounded-lg" />
                <div className="relative text-sm font-medium text-zinc-200 bg-zinc-900 px-4 py-3 rounded-lg border border-zinc-800">
                  {generatedKey?.label}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Secret Key</label>
              <div className="relative group">
                <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg blur opacity-25" />
                <div className="relative flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 pl-4 rounded-lg overflow-hidden">
                  <code className="flex-1 font-mono text-xs text-emerald-400 truncate py-2 select-all">
                    {showRawKey ? generatedKey?.rawKey : "•".repeat(40)}
                  </code>
                  <div className="flex items-center gap-1 pr-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowRawKey(!showRawKey)}
                      className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-zinc-800"
                    >
                      {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => handleCopy(generatedKey?.rawKey || "", "generated")}
                      className="h-9 px-4 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium gap-2 shadow-inner"
                    >
                      {copiedId === "generated" ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                If you lose this key, you will need to revoke it and generate a new one. We do not store raw keys.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-zinc-100 text-black hover:bg-white px-8"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
