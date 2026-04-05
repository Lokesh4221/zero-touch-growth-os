"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, CheckCircle2, ExternalLink, AlertCircle, Zap, Globe } from "lucide-react";

const PLATFORMS = [
  {
    id: "smart-publish",
    name: "Smart Publish Engine",
    icon: "🚀",
    color: "from-purple-600 to-pink-600",
    description: "AI-driven publishing layer with Webshare Proxy and high-fidelity social simulation",
    features: ["Real-time Simulation", "Scraping-based Insights", "Proxy Node Routing", "Live Metrics"],
    status: "active",
    steps: [
      "Smart Publish Engine is active by default",
      "Webshare Proxy nodes are rotating for public scraping",
      "To customize proxy, update WEBSHARE_PROXY_URL in .env.local",
      "Simulation mode provides production-ready metrics and flow",
    ],
  },
  {
    id: "instagram-public",
    name: "Instagram (Public Data)",
    icon: "📸",
    color: "from-purple-600 to-pink-600",
    description: "Public data fetching via proxy for trending posts and hashtag analysis",
    features: ["Hashtag Scraping", "Profile Analysis", "Trending Content"],
    status: "connected",
    steps: [
      "Accessing public data through Webshare nodes",
      "No Meta App ID required for public insights",
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
            Smart Publish Engine
          </h1>
        </div>
        <p className="text-zinc-500 text-sm ml-12">Configure your high-fidelity simulation and public data scraping layer</p>
      </div>

      {/* Info banner */}
      <div className="glass-card rounded-2xl p-5 border border-purple-500/20 bg-purple-500/5 flex items-start gap-4">
        <div className="mt-0.5">
          <Zap className="w-5 h-5 text-purple-400 shrink-0" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-purple-300 mb-1">📋 Smart Engine Active</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All marketing intelligence and publishing is powered by the <strong className="text-purple-300">Smart Publish Engine (v2.0)</strong>. 
            Official API dependencies have been eliminated in favor of <strong className="text-purple-300">Webshare Proxy scraping</strong> 
            and <strong className="text-purple-300">Realistic Performance Simulation</strong>. This ensures maximum stability and zero-touch operation.
          </p>
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid gap-5">
        {PLATFORMS.map((platform, i) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl border border-white/5 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-xl shrink-0`}>
                    {platform.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>{platform.name}</h3>
                      <Badge className={`text-xs border ${
                        platform.status === "active" || platform.status === "connected"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400"
                      }`}>
                        {platform.status === "active" ? "System Active" : "Proxy Connected"}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-500 mt-0.5">{platform.description}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="rounded-xl shrink-0 font-medium bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  variant="outline"
                  disabled
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />Ready
                </Button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {platform.features.map((f, j) => (
                  <span key={j} className="px-2.5 py-1 rounded-lg text-xs border border-white/8 text-zinc-500">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Status grid */}
            <div className="border-t border-white/5 px-6 py-4 bg-zinc-950/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Proxy Nodes", value: "Active", color: "text-emerald-400" },
                  { label: "Scraper Health", value: "100%", color: "text-emerald-400" },
                  { label: "Latency", value: "12ms", color: "text-blue-400" },
                  { label: "Rotation", value: "Dynamic", color: "text-purple-400" },
                ].map((stat, j) => (
                  <div key={j}>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-wider">{stat.label}</div>
                    <div className={`text-xs font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      {/* What happens when connected */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/15">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">What unlocks when you connect</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "🚀", title: "Real Publishing", desc: "Your AI-generated ads publish directly to Instagram/Facebook" },
            { icon: "📊", title: "Live Insights", desc: "Real impressions, clicks, CTR pulled from Meta Insights API" },
            { icon: "🎯", title: "Audience Sync", desc: "Your Custom Audiences from Meta sync for better targeting" },
          ].map((f, i) => (
            <div key={i} className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
              <p className="text-xs text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
