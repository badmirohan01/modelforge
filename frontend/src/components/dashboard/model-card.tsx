import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Activity, Clock, ChevronRight } from "lucide-react";
import { ModelResponse } from "@/types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ModelCardProps {
  model: ModelResponse;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <Cpu className="w-5 h-5 text-zinc-400" />
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Active
          </Badge>
        </div>
        <CardTitle className="text-xl text-white line-clamp-1">{model.name}</CardTitle>
        <p className="text-sm text-zinc-400 line-clamp-2 mt-1 min-h-[40px]">
          {model.description || "No description provided."}
        </p>
      </CardHeader>
      
      <CardContent className="pb-4 flex-1">
        <div className="grid grid-cols-2 gap-2 text-sm text-zinc-500 mb-4">
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-zinc-600" />
            <span>{(model.totalCalls || 0).toLocaleString()} calls</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-zinc-600" />
            <span>{(model.avgLatencyMs || 0).toFixed(0)}ms avg</span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-zinc-600">
          <span>v{model.latestVersion}</span>
          <span>Created {formatDistanceToNow(new Date(model.createdAt), { addSuffix: true })}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild className="w-full bg-white hover:bg-zinc-200 text-black font-medium">
          <Link href={`/models/${model.id}`}>
            Manage Model
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
