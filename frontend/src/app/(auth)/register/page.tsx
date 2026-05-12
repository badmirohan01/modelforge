"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Box, Loader2, Zap, Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  const errorMessage =
    error?.response?.data?.message ||
    (error ? "Registration failed. Please try again." : null);

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
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Join the Forge</h2>
          <p className="text-zinc-400 mt-2">Create your account and start deploying in seconds.</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {errorMessage && (
              <p className="text-sm text-red-400 text-center">{errorMessage}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-white hover:bg-zinc-200 text-black font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <Zap className="w-4 h-4 fill-current" />
                </span>
              )}
            </Button>
          </form>
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
