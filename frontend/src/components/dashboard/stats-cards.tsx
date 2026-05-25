import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Activity, Zap, TrendingUp } from "lucide-react";
import { ModelResponse } from "@/types";

interface StatsCardsProps {
  models?: ModelResponse[];
  isLoading: boolean;
  activeKeyCount?: number;
}

export function StatsCards({ models = [], isLoading, activeKeyCount = 0 }: StatsCardsProps) {
  const totalModels = models.length;
  const totalInferences = models.reduce((sum, m) => sum + (m.totalCalls || 0), 0);
  const avgLatency = models.length
    ? (models.reduce((sum, m) => sum + (m.avgLatencyMs || 0), 0) / models.length).toFixed(0)
    : 0;

  const activeKeys = activeKeyCount;

  const stats = [
    { label: "Total Models", value: totalModels, icon: Layers, color: "text-zinc-300" },
    { label: "Total Inferences", value: totalInferences, icon: Activity, color: "text-white" },
    { label: "Avg Latency", value: `${avgLatency}ms`, icon: Zap, color: "text-zinc-400" },
    { label: "Active API Keys", value: activeKeys, icon: TrendingUp, color: "text-zinc-500" }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-zinc-800 rounded"></div>
              <div className="h-4 w-4 bg-zinc-800 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-zinc-800 rounded mt-1"></div>
              <div className="h-3 w-32 bg-zinc-800 rounded mt-3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="flex items-center text-xs text-zinc-500 mt-1">
              <span className="text-zinc-500">Updated just now</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
