"use client";

import { HeroSection } from "@/components/hero-section-1";
import { Shield, Zap, Code, BarChart3, Cpu, Mail, Terminal, Send, Globe } from "lucide-react";
import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary/30">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section - Restored and Polished */}
      <section id="features" className="py-24 bg-zinc-900/30 relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 font-stylish">
              Built for Production
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Everything you need to deploy, monitor, and scale your machine learning models at the speed of thought.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="w-6 h-6" />}
              title="Instant Deployment"
              description="Upload your .pkl, .pt, or .h5 files and get a high-performance API endpoint in seconds."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Performance"
              description="Sub-10ms inference overhead with automatic GPU acceleration when your models need it."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="Enterprise Security"
              description="Private model isolation, automatic vulnerability scanning, and robust JWT/API Key auth."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Real-time Analytics"
              description="Deep insights into your model's health, latency, and throughput with built-in monitoring."
            />
            <FeatureCard 
              icon={<Code className="w-6 h-6" />}
              title="Developer First API"
              description="RESTful endpoints designed for developers. Seamless integration with your existing CI/CD pipelines."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6" />}
              title="Global Scalability"
              description="Deploy your models closer to your users with our globally distributed edge infrastructure."
            />
          </div>
        </div>
      </section>

      {/* Content Section - "Focus on data, not devops" */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <h2 className="text-3xl lg:text-5xl font-bold mb-8 font-stylish">
              Focus on your data, <br />
              <span className="text-primary italic">Not on your DevOps.</span>
            </h2>
            <p className="text-zinc-400 text-xl leading-relaxed mb-12">
              ModelForge handles the heavy lifting of infrastructure, environment management, 
              and scaling. Spend your time training better models, not debugging Docker containers 
              or managing Kubernetes clusters.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-zinc-500 font-medium italic">
              <span>#PyTorch</span>
              <span>•</span>
              <span>#ScikitLearn</span>
              <span>•</span>
              <span>#XGBoost</span>
              <span>•</span>
              <span>#TensorFlow</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                  <Cpu className="text-primary-foreground w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter italic">MODEL<span className="text-primary">FORGE</span></span>
              </div>
              <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">
                The high-performance inference platform built for modern AI teams. 
                Deploy models in seconds, not weeks.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Send className="w-5 h-5" /></Link>
                <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Terminal className="w-5 h-5" /></Link>
                <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Mail className="w-5 h-5" /></Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#solutions" className="hover:text-primary transition-colors">Solutions</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-zinc-500 text-sm">
                <li><Link href="#about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs">
            <p>© 2026 ModelForge Inc. All rights reserved.</p>
            <p>Built with precision in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-zinc-900 transition-all group">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-zinc-100 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{description}</p>
    </div>
  );
}
