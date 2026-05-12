"use client";

import { useModels } from "@/hooks/useModels";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { UploadModal } from "@/components/dashboard/upload-model";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function DashboardPage() {
  const { data: models, isLoading, error } = useModels();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Failed to load dashboard data</h2>
          <p className="text-zinc-400 mt-1">{error.message || "Please check your connection and try again."}</p>
        </div>
        <Button variant="outline" className="mt-4 border-zinc-800 text-zinc-300" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-400">Monitor your models and inference performance.</p>
        </div>
        <UploadModal />
      </div>

      {/* Stats Grid */}
      <StatsCards models={models} isLoading={isLoading} />

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Models Table */}
        <Card className="lg:col-span-2 border-zinc-800 bg-zinc-900/50 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Models</CardTitle>
                <CardDescription className="text-zinc-400">A list of your recently deployed models and their status.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <Link href="/models">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-zinc-800/50 rounded-md animate-pulse"></div>
                ))}
              </div>
            ) : !models || models.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center border border-dashed border-zinc-800 rounded-lg">
                <p className="text-zinc-500 mb-2">No models deployed yet</p>
                <UploadModal />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Model Name</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Version</TableHead>
                    <TableHead className="text-zinc-400 text-right">Calls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.slice(0, 4).map((model) => (
                    <TableRow key={model.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                      <TableCell className="font-medium text-white">
                        <Link href={`/models/${model.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                          {model.name}
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-xs">v{model.latestVersion}</TableCell>
                      <TableCell className="text-right font-mono text-zinc-400">{(model.totalCalls || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <Card className="border-zinc-800 bg-zinc-900/50 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Resource Usage</CardTitle>
            <CardDescription className="text-zinc-400">Monthly plan consumption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Inference Units</span>
                  <span className="text-zinc-50 font-mono">
                    {models ? models.reduce((acc, m) => acc + (m.totalCalls || 0), 0).toLocaleString() : 0} / 5,000
                  </span>
                </div>
                <Progress 
                  value={models ? Math.min((models.reduce((acc, m) => acc + (m.totalCalls || 0), 0) / 5000) * 100, 100) : 0} 
                  className="h-1.5 bg-zinc-800" 
                />
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                  <span>Free tier limit: 5k</span>
                  <span className="text-white cursor-pointer hover:underline">Upgrade to Pro</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Active Storage</span>
                  <span className="text-zinc-50">
                    {models ? (models.length * 0.4).toFixed(1) : "0.0"} GB / 10.0 GB
                  </span>
                </div>
                <Progress 
                  value={models ? Math.min(((models.length * 0.4) / 10) * 100, 100) : 0} 
                  className="h-1.5 bg-zinc-800" 
                />
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-zinc-800">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm font-medium text-white mb-1">Upgrade Plan</p>
                <p className="text-xs text-zinc-400 mb-3">Get unlimited inferences and 50GB storage.</p>
                <Button size="sm" className="w-full bg-white hover:bg-zinc-200 text-black text-xs font-bold">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
