"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Box, Code, Globe, Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Login Response:", response.data);
      const { token, email: userEmail } = response.data;
      
      login(token, userEmail);
      toast.success("Welcome back, developer.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Authentication failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full animate-pulse" />
      
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
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Access the Forge</h2>
          <p className="text-zinc-400 mt-2">Log in to manage your high-performance models.</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="dev@modelforge.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-950/50 border-white/5 focus:border-white/20 transition-colors h-12"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-400 text-sm">Password</Label>
                <Link href="#" className="text-xs text-white/60 hover:text-white hover:underline transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-950/50 border-white/5 focus:border-white/20 transition-colors h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
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
                  Initialize Session <Zap className="w-4 h-4 fill-current" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500 font-mono tracking-widest">Or continue with</span>
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
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-white hover:underline font-medium transition-colors">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
