"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { 
  Box, 
  LayoutDashboard, 
  Cpu, 
  Key, 
  History, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bell,
  Search,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Models", icon: Cpu, href: "/dashboard/models" },
  { label: "API Keys", icon: Key, href: "/dashboard/settings" },
  { label: "Inference Logs", icon: History, href: "/dashboard/logs" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Redirect if not authenticated (client-side fallback for middleware)
  useEffect(() => {
    // Note: In a real app, you'd wait for the store to hydrate
    // For this demo, we assume store is ready or redirect happens in middleware
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl transition-all duration-300 flex flex-col z-50`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 shrink-0 overflow-hidden">
          <Link href="/" className="flex items-center gap-3">
            <Logo className={cn("h-7 w-auto transition-all", !isSidebarOpen && "scale-110")} />
          </Link>
        </div>

        <Separator className="bg-zinc-800" />

        {/* Sidebar Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "group-hover:text-zinc-50"}`} />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                {isActive && isSidebarOpen && <ChevronRight className="ml-auto w-4 h-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 mt-auto">
          <div className={`p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 mb-4 overflow-hidden ${!isSidebarOpen && "hidden"}`}>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">User Profile</p>
            <p className="text-sm font-medium truncate">{user?.email || "User"}</p>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-zinc-400"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search models or logs..." 
                className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-zinc-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-zinc-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </Button>
            <Separator orientation="vertical" className="h-6 bg-zinc-800" />
            <div className="flex items-center gap-3 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-400 flex items-center justify-center font-bold text-xs uppercase shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {user?.email?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
