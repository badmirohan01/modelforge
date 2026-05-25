import Link from "next/link";
import { Cpu, Mail, Terminal, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <Cpu className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tighter italic">
                MODEL<span className="text-primary">FORGE</span>
              </span>
            </div>
            <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">
              The high-performance inference platform built for modern AI teams.
              Deploy models in seconds, not weeks.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-zinc-600 hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-zinc-600 hover:text-white transition-colors">
                <Terminal className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-zinc-600 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-6">
              Product
            </h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li>
                <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="#docs" className="hover:text-primary transition-colors">Documentation</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li>
                <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-xs">
          <p>© 2026 ModelForge Inc. All rights reserved.</p>
          <p>Built with precision in India.</p>
        </div>
      </div>
    </footer>
  );
}
