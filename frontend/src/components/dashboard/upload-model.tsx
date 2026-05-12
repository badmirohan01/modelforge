"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadModel } from "@/hooks/useModels";
import { Loader2, Plus } from "lucide-react";

export function UploadModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending, error } = useUploadModel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // Use FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);

    mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        setName("");
        setDescription("");
        setFile(null);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          <Plus className="w-4 h-4 mr-2" />
          Deploy New Model
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Deploy New Model</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Upload your compiled model file (.pkl) to deploy it instantly to an endpoint.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">Model Name</Label>
            <Input
              id="name"
              placeholder="e.g. sentiment-v1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-600 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">Description</Label>
            <Input
              id="description"
              placeholder="What does this model do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-600 focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-zinc-300">Model File (.pkl)</Label>
            <Input
              id="file"
              type="file"
              accept=".pkl"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="bg-zinc-900 border-zinc-800 text-white file:text-white file:bg-zinc-800 file:border-0 file:mr-4 file:py-1 file:px-3 file:rounded-sm hover:file:bg-zinc-700 focus:border-zinc-600 focus:ring-0 cursor-pointer"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center">{error.message}</p>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !file}
              className="bg-white text-black hover:bg-zinc-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                "Deploy Model"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
