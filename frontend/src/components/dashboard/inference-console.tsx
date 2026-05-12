"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Terminal, Play, Loader2 } from "lucide-react";

interface InferenceConsoleProps {
  onInfer: (inputs: unknown) => void;
  isPending: boolean;
  result: any; // Ideally InferResponse | null but we are taking the raw state from the hook
}

export function InferenceConsole({ onInfer, isPending, result }: InferenceConsoleProps) {
  const [inputJson, setInputJson] = useState("{\n  \"features\": [0.5, 0.1, -0.2]\n}");
  const [error, setError] = useState<string | null>(null);

  const handleRun = () => {
    setError(null);
    try {
      const parsed = JSON.parse(inputJson);
      onInfer(parsed);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 flex flex-col h-full shadow-2xl shadow-black/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Terminal className="w-5 h-5 text-zinc-400" />
          Inference Console
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Test your deployed model by sending a JSON payload directly to the inference engine.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-5 pt-0">
        <div className="space-y-2.5 flex-1 flex flex-col min-h-[200px]">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Input Payload (JSON)</label>
            {error && <span className="text-[10px] font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{error}</span>}
          </div>
          <Textarea
            value={inputJson}
            onChange={(e) => {
              setInputJson(e.target.value);
              if (error) setError(null);
            }}
            className="flex-1 font-mono text-sm bg-zinc-950/40 border-zinc-800 text-zinc-300 focus:border-zinc-500 focus:ring-0 resize-none rounded-xl p-4 transition-colors hover:border-zinc-700"
            spellCheck={false}
          />
        </div>

        <Button
          onClick={handleRun}
          disabled={isPending}
          className="w-full bg-white text-black hover:bg-zinc-200 font-bold h-12 rounded-xl transition-all duration-300 shadow-xl shadow-white/5 active:scale-[0.98]"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Running Inference...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2 fill-current" />
              Run Inference
            </>
          )}
        </Button>

        {result && (
          <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Output Result</label>
            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 overflow-auto">
              <pre className="text-sm font-mono text-green-400">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
