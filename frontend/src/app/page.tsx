"use client";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { HeroSection } from "@/components/hero-section-1";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Focus on Data Section */}
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

      <Footer />
    </div>
  );
}
