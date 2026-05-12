"use client";

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
import { InferenceLogResponse } from "@/types";
import { format } from "date-fns";
import { History, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogsTableProps {
  logs: InferenceLogResponse[] | undefined;
  isLoading: boolean;
  page: number;
  onPageChange: (newPage: number) => void;
}

export function LogsTable({ logs, isLoading, page, onPageChange }: LogsTableProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <History className="w-5 h-5 text-zinc-400" />
          Inference History
        </CardTitle>
        <CardDescription className="text-zinc-400">
          A paginated log of all inference requests made to this model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-800/50 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
            No inference logs found. Run a test inference to see logs here.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-950/50">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Timestamp</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Latency</TableHead>
                    <TableHead className="text-zinc-400">Version</TableHead>
                    <TableHead className="text-zinc-400 text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                      <TableCell className="font-medium text-zinc-300">
                        {format(new Date(log.calledAt), "MMM d, yyyy HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            log.status === "SUCCESS" 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-zinc-400 font-mono text-sm">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {log.latencyMs}ms
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-xs">v{log.versionNumber}</TableCell>
                      <TableCell className="text-right">
                        {log.errorMessage ? (
                          <span className="text-xs text-red-400 truncate max-w-[150px] inline-block" title={log.errorMessage}>
                            {log.errorMessage}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-600">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between text-sm text-zinc-500">
              <span>Showing page {page + 1}</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onPageChange(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="border-zinc-800 bg-transparent hover:bg-zinc-800 hover:text-white h-8 px-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onPageChange(page + 1)}
                  disabled={logs.length < 20} // Assuming 20 is the page size
                  className="border-zinc-800 bg-transparent hover:bg-zinc-800 hover:text-white h-8 px-2"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
