"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Box, Code, Globe, Loader2, Zap } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", { name, email, password });
      toast.success("Account created successfully. You can now log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full animate-thunder" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-white/5 opacity-0 animate-lightning pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Box className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Model<span className="text-zinc-500 font-light">Forge</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Join the Forge</h2>
          <p className="text-zinc-400 mt-2">Create your account and start deploying in seconds.</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-400 text-sm">Full Name</Label>
              <Input
                id="name"
                placeholder="Nikola Tesla"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-zinc-950/50 border-white/5 focus:border-white/20 transition-colors h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="tesla@modelforge.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-950/50 border-white/5 focus:border-white/20 transition-colors h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-400 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-950/50 border-white/5 focus:border-white/20 transition-colors h-12"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-white hover:bg-zinc-200 text-black font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <Zap className="w-4 h-4 fill-current" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500 font-mono tracking-widest">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="border-white/10 bg-zinc-950/50 hover:bg-white/5 text-zinc-300 transition-all">
              <Code className="w-4 h-4 mr-2" /> GitHub
            </Button>
            <Button variant="outline" className="border-white/10 bg-zinc-950/50 hover:bg-white/5 text-zinc-300 transition-all">
              <Globe className="w-4 h-4 mr-2" /> Google
            </Button>
          </div>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline font-medium transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
