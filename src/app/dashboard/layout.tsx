"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import MouseSpotlight from "@/components/MouseSpotlight";
import ParticleField from "@/components/ParticleField";
import PageTransition from "@/components/PageTransition";
import {
  LayoutDashboard,
  CalendarDays,
  PenTool,
  Megaphone,
  LogOut,
  Sparkles,
  MessageSquare,
  GitCompare,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
  Bot,
  Command,
  Play,
  Rocket,
  Wand2,
  Link2,
  User,
} from "lucide-react";

const navItems = [
  { title: "✦ Ad Studio", href: "/dashboard/create", icon: Wand2, color: "text-pink-400" },
  { title: "Business Profile", href: "/dashboard/profile", icon: LayoutDashboard, color: "text-blue-400" },
  { title: "Weekly Strategy", href: "/dashboard/strategy", icon: CalendarDays, color: "text-purple-400" },
  { title: "Content Studio", href: "/dashboard/content", icon: PenTool, color: "text-pink-400" },
  { title: "Growth & Ads", href: "/dashboard/ads", icon: Megaphone, color: "text-emerald-400" },
  { title: "AI Copilot", href: "/dashboard/chat", icon: Bot, color: "text-cyan-400" },
  { title: "Competitors", href: "/dashboard/competitors", icon: GitCompare, color: "text-orange-400" },
  { title: "Funnel Builder", href: "/dashboard/funnel", icon: TrendingUp, color: "text-rose-400" },
  { title: "What If Simulator", href: "/dashboard/simulator", icon: Play, color: "text-cyan-400" },
  { title: "Campaign Generator", href: "/dashboard/campaign", icon: Rocket, color: "text-purple-400" },
  { title: "Integrations", href: "/dashboard/integrations", icon: Link2, color: "text-blue-400" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { onboardingData } = useBusiness();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const cmdRef = useRef<HTMLInputElement>(null);



  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
        setCmdQuery("");
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (cmdOpen) setTimeout(() => cmdRef.current?.focus(), 50);
  }, [cmdOpen]);

  const filteredNav = navItems.filter((n) =>
    n.title.toLowerCase().includes(cmdQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col md:flex-row font-sans" style={{ background: "#030303" }}>
      <MouseSpotlight />
      <ParticleField count={25} />
      
      {/* Ambient background */}
      <div className="orb orb-purple w-[600px] h-[600px] top-[-200px] left-[-100px] opacity-40" />
      <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-0 opacity-30" />

      {/* CMD+K Overlay */}
      {cmdOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setCmdOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative glass-card rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl glow-purple" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Search className="w-5 h-5 text-zinc-500 shrink-0" />
              <input
                ref={cmdRef}
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Navigate or ask AI anything..."
                className="flex-1 bg-transparent text-white placeholder:text-zinc-600 text-sm outline-none"
              />
              <kbd className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">ESC</kbd>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {filteredNav.length === 0 ? (
                <div className="flex items-center gap-3 px-4 py-3 text-zinc-500 text-sm">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <span>AI Chat: "{cmdQuery}"</span>
                </div>
              ) : filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setCmdOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm text-zinc-300 group-hover:text-white">{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-white/5 px-5 py-3 flex items-center gap-4 text-xs text-zinc-600">
              <span className="flex items-center gap-1"><kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded">↵</kbd> select</span>
              <span className="flex items-center gap-1"><kbd className="bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded">ESC</kbd> close</span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-[72px]" : "w-64"} border-r border-white/5 flex flex-col z-20 sticky top-0 h-screen transition-all duration-300 ease-in-out shrink-0`}
        style={{ background: "rgba(9,9,11,0.95)", backdropFilter: "blur(24px)" }}
      >
        {/* Logo */}
        <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "gap-3"} border-b border-white/5`}>
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl shrink-0 pulse-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sm leading-tight tracking-tight text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Zero-Touch</h2>
              <p className="text-[10px] text-zinc-500 font-medium">Growth OS</p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 bg-zinc-800 border border-zinc-700 rounded-full p-1 text-zinc-400 hover:text-white z-30 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* CMD+K button */}
        {!collapsed && (
          <div className="px-4 pt-4">
            <button
              onClick={() => setCmdOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-purple-500/40 hover:text-zinc-300 transition-all text-xs group"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="flex-1 text-left">Quick search...</span>
              <kbd className="text-[10px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded group-hover:border-purple-500/40">⌘K</kbd>
            </button>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-4 pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <span
                  title={collapsed ? item.title : undefined}
                  className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-xl transition-all duration-200 relative group ${
                    isActive ? "nav-active" : "text-zinc-500 hover:text-zinc-100 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? item.color : ""}`} />
                  {!collapsed && <span className={`font-medium text-sm ${isActive ? "text-white" : ""}`}>{item.title}</span>}
                  {isActive && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  )}
                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1 glass-card rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                      {item.title}
                    </div>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className={`p-3 border-t border-white/5 space-y-2`}>
          {onboardingData?.businessName && !collapsed && (
            <div className="px-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Active Business</p>
              </div>
              <p className="text-xs font-semibold text-white truncate">{onboardingData.businessName}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-h-screen overflow-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-white/5 px-6 py-3 flex items-center justify-between" style={{ background: "rgba(3,3,3,0.9)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-zinc-400">
              {navItems.find(n => n.href === pathname)?.title || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-purple-500/40 hover:text-zinc-300 transition-all text-xs"
            >
              <Zap className="w-3 h-3 text-purple-400" />
              <span>AI Command</span>
              <kbd className="ml-1 text-[10px] bg-zinc-800 border border-zinc-700 px-1 py-0.5 rounded">⌘K</kbd>
            </button>
            {onboardingData?.businessName && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: "pulse-glow 2s infinite" }} />
                <span className="text-xs text-zinc-300 font-medium">{onboardingData.businessName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </div>
      </main>
    </div>
  );
}
