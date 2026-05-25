import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2, Key as KeyIcon, Check, Loader2, AlertCircle, Eye, EyeOff, Pencil, X, Ban, Globe, Database } from "lucide-react";
import { ApiKeyResponse, ModelResponse } from "@/types";
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
  models: ModelResponse[] | undefined;
  isLoading: boolean;
  onGenerate: (label: string, isGlobal: boolean, modelIds: string[]) => Promise<ApiKeyResponse | void>;
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, label: string) => void;
  isGenerating: boolean;
}

export function ApiKeyCard({ keys, models, isLoading, onGenerate, onRevoke, onDelete, onUpdate, isGenerating }: ApiKeyCardProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<ApiKeyResponse | null>(null);
  const [showRawKey, setShowRawKey] = useState(false);
  
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
      const result = await onGenerate(newLabel, isGlobal, selectedModelIds);
      if (result && result.rawKey) {
        setGeneratedKey(result);
        setShowSuccessModal(true);
        setNewLabel("");
        setIsCreateOpen(false);
        setSelectedModelIds([]);
        setIsGlobal(true);
      }
    } catch (error) {
      console.error("Failed to generate key", error);
    }
  };

  const toggleModelSelection = (id: string) => {
    if (selectedModelIds.includes(id)) {
      setSelectedModelIds(selectedModelIds.filter(m => m !== id));
    } else {
      setSelectedModelIds([...selectedModelIds, id]);
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

  const getModelNames = (modelIds: string[]) => {
    if (!models || !modelIds) return [];
    return modelIds.map(id => models.find(m => m.id === id)?.name || "Unknown Model");
  };

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900/50 shadow-2xl shadow-black/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <KeyIcon className="w-5 h-5 text-zinc-400" />
              Your API Keys
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-1">
              Keys are used to authenticate your requests to the API.
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)} 
            className="bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Key
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-20 bg-zinc-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : !keys || keys.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                No API keys generated yet.
              </div>
            ) : (
              keys.map((key) => (
                <div key={key.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-950/30 hover:bg-zinc-900/50 transition-all duration-200 group gap-4">
                  
                  {/* Left Column: Label & Key Prefix */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2.5 mb-2">
                      {editingId === key.id ? (
                        <div className="flex items-center gap-1.5 w-full max-w-xs">
                          <Input
                            autoFocus
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(key.id)}
                            className="h-8 text-sm bg-zinc-900 border-zinc-700 text-white focus:ring-1 focus:ring-primary/50"
                          />
                          <button onClick={() => saveEdit(key.id)} className="p-1.5 hover:text-emerald-400 transition-colors bg-zinc-800 rounded-md">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEditing} className="p-1.5 hover:text-red-400 transition-colors bg-zinc-800 rounded-md">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="font-bold text-base text-zinc-100">{key.label}</span>
                          <button 
                            onClick={() => startEditing(key)} 
                            className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                            title="Rename Key"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 bg-zinc-900/50 w-fit px-2.5 py-1 rounded-md border border-zinc-800/50">
                      <KeyIcon className="w-3.5 h-3.5 text-zinc-600" />
                      <span>mf_...{key.id.substring(0, 12)}</span>
                    </div>
                  </div>
                  
                  {/* Middle Column: Access Rights */}
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1.5">Access</p>
                    <div className="flex flex-wrap gap-1.5">
                      {key.isGlobal ? (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs font-normal">
                          <Globe className="w-3 h-3 mr-1" /> All Models
                        </Badge>
                      ) : key.modelIds && key.modelIds.length > 0 ? (
                        getModelNames(key.modelIds).map((name, i) => (
                          <Badge key={i} variant="outline" className="text-zinc-300 border-zinc-700 bg-zinc-900 text-xs font-normal">
                            <Database className="w-3 h-3 mr-1 text-zinc-500" /> {name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-zinc-500">None</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Status & Meta */}
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1.5">Status</p>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 border-none font-medium ${
                          key.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {key.isActive ? "Active" : "Revoked"}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-zinc-600">
                      <div>Created {format(new Date(key.createdAt), "MMM d, yyyy")}</div>
                      {key.lastUsedAt ? (
                        <div className="mt-0.5 text-zinc-500">Used {formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}</div>
                      ) : (
                        <div className="mt-0.5">Never used</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 md:pl-4 md:border-l border-zinc-800">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCopy(`mf_...${key.id.substring(0, 12)}`, key.id)}
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800 w-full justify-start md:justify-center h-8"
                      title="Copy Key ID"
                    >
                      {copiedId === key.id ? <Check className="w-4 h-4 text-emerald-500 md:mr-0 mr-2" /> : <Copy className="w-4 h-4 md:mr-0 mr-2" />}
                      <span className="md:hidden">Copy ID</span>
                    </Button>
                    
                    {key.isActive && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onRevoke(key.id)}
                        className="text-amber-500/70 hover:text-amber-400 hover:bg-amber-400/10 w-full justify-start md:justify-center h-8"
                        title="Revoke Key"
                      >
                        <Ban className="w-4 h-4 md:mr-0 mr-2" />
                        <span className="md:hidden">Revoke</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(key.id)}
                      className="text-red-500/70 hover:text-red-400 hover:bg-red-400/10 w-full justify-start md:justify-center h-8"
                      title="Delete Key"
                    >
                      <Trash2 className="w-4 h-4 md:mr-0 mr-2" />
                      <span className="md:hidden">Delete</span>
                    </Button>
                  </div>

                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Key Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription className="text-zinc-400 pt-2">
              Generate a new API key for authentication.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Key Name</label>
              <Input 
                placeholder="e.g. Production Key" 
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white focus:border-zinc-500 focus:ring-0"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-300">Access Scope</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsGlobal(true)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isGlobal 
                      ? 'bg-primary/10 border-primary text-white' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Globe className={`w-5 h-5 mb-2 ${isGlobal ? 'text-primary' : 'text-zinc-500'}`} />
                  <div className="font-semibold text-sm">All Models</div>
                  <div className="text-[10px] mt-1 opacity-70">Access to every model in your account.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGlobal(false)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    !isGlobal 
                      ? 'bg-primary/10 border-primary text-white' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Database className={`w-5 h-5 mb-2 ${!isGlobal ? 'text-primary' : 'text-zinc-500'}`} />
                  <div className="font-semibold text-sm">Selected Models</div>
                  <div className="text-[10px] mt-1 opacity-70">Limit access to specific models only.</div>
                </button>
              </div>
            </div>

            {!isGlobal && models && models.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-xs font-semibold text-zinc-300">Select Models</label>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  {models.map(model => (
                    <label key={model.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer transition-colors">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={selectedModelIds.includes(model.id)}
                          onChange={() => toggleModelSelection(model.id)}
                        />
                        <div className="w-4 h-4 rounded-[4px] border border-zinc-600 peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          {selectedModelIds.includes(model.id) && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <span className="text-sm text-zinc-300">{model.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsCreateOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={!newLabel.trim() || isGenerating || (!isGlobal && selectedModelIds.length === 0)}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Generate"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
