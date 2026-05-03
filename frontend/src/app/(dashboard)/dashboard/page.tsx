"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Activity, 
  Layers, 
  Zap, 
  MoreHorizontal, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from "lucide-react";
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

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalModels: 4,
    totalInferences: 1284,
    avgLatency: "42ms",
    activeKeys: 2
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-400">Monitor your models and inference performance.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          <Plus className="w-4 h-4 mr-2" />
          Deploy New Model
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Models", value: stats.totalModels, icon: Layers, color: "text-zinc-300" },
          { label: "Total Inferences", value: stats.totalInferences, icon: Activity, color: "text-white" },
          { label: "Avg Latency", value: stats.avgLatency, icon: Zap, color: "text-zinc-400" },
          { label: "Active API Keys", value: stats.activeKeys, icon: TrendingUp, color: "text-zinc-500" }
        ].map((stat, i) => (
          <Card key={i} className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs text-zinc-500 mt-1">
                <TrendingUp className="w-4 h-4 text-white mr-1" />
                <span className="text-white text-xs font-medium">+12.5%</span>
                {" "}from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Models Table */}
        <Card className="lg:col-span-2 border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Models</CardTitle>
                <CardDescription>A list of your recently deployed models and their status.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-zinc-400">Model Name</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Type</TableHead>
                  <TableHead className="text-zinc-400 text-right">Calls</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Sentiment Analyzer v2", status: "Active", type: "PyTorch", calls: "432" },
                  { name: "Image Classifier", status: "Active", type: "TensorFlow", calls: "128" },
                  { name: "Sales Predictor", status: "Idle", type: "Scikit-Learn", calls: "721" },
                  { name: "Spam Filter", status: "Error", type: "Keras", calls: "3" }
                ].map((model, i) => (
                  <TableRow key={i} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {model.name}
                        <ExternalLink className="w-3 h-3 text-zinc-600" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={
                          model.status === "Active" ? "bg-primary/10 text-primary border-primary/20" :
                          model.status === "Error" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }
                      >
                        {model.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-xs">{model.type}</TableCell>
                    <TableCell className="text-right font-mono text-zinc-400">{model.calls}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
            <CardDescription>Monthly plan consumption</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Inference Units</span>
                <span className="text-zinc-50">1,284 / 5,000</span>
              </div>
              <Progress value={25} className="h-1.5 bg-zinc-800" />
              <div className="flex items-center justify-between text-[10px] text-zinc-500">
                <span>Free tier limit: 5k</span>
                <span className="text-white cursor-pointer hover:underline">Upgrade to Pro</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Active Storage</span>
                <span className="text-zinc-50">4.2 GB / 10 GB</span>
              </div>
              <Progress value={42} className="h-1.5 bg-zinc-800" />
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-800">
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
