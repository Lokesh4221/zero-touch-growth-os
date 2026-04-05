"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Target, TrendingUp, HandCoins, Lightbulb, PlayCircle, MousePointerClick, BarChart3, Wand2, RefreshCw, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { toast } from "sonner";
import AnimatedCounter from "@/components/AnimatedCounter";
import AIThinkingState from "@/components/AIThinkingState";
import { PUBLISH_STEPS, generateSimulationMetrics, generatePlatformId } from "@/lib/simulation";

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const TREND_DATA = [
  { day: "D1", roas: 1.2, ctr: 1.5 }, { day: "D2", roas: 1.5, ctr: 1.8 },
  { day: "D3", roas: 1.8, ctr: 2.1 }, { day: "D4", roas: 1.6, ctr: 1.9 },
  { day: "D5", roas: 2.4, ctr: 2.5 }, { day: "D6", roas: 2.8, ctr: 2.9 }, { day: "D7", roas: 3.2, ctr: 3.4 },
];

const BUDGET_DATA = [
  { name: "Instagram Reels", current: 45, optimized: 52, color: "#ec4899" },
  { name: "Google Search", current: 30, optimized: 25, color: "#3b82f6" },
  { name: "Facebook Feed", current: 15, optimized: 13, color: "#4f46e5" },
  { name: "TikTok / Shorts", current: 10, optimized: 10, color: "#14b8a6" },
];

const PIE_DATA = BUDGET_DATA.map(d => ({ name: d.name, value: d.current, color: d.color }));

const RADAR_DATA = [
  { metric: "Creative", A: 82, B: 68 },
  { metric: "Targeting", A: 75, B: 88 },
  { metric: "CTR", A: 90, B: 72 },
  { metric: "Conv Rate", A: 68, B: 78 },
  { metric: "ROAS", A: 85, B: 70 },
];

const TOOLTIP_STYLE = { backgroundColor: "#09090b", borderColor: "rgba(255,255,255,0.06)", borderRadius: "12px", color: "#fff", fontSize: "12px" };

export default function AdsPage() {
  const { ads, stats, setAds, setStats, profile, onboardingData } = useBusiness();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  useEffect(() => {
    setMounted(true);
    if ((!ads || !stats) && profile && !loading) generateAds();
  }, [profile]);

  const generateAds = async () => {
    setLoading(true);
    try {
      const payload = {
        businessName: onboardingData?.businessName || profile?.businessName,
        businessType: onboardingData?.businessType || profile?.industry,
        targetAudience: onboardingData?.targetAudience || profile?.targetAudience,
        location: onboardingData?.location,
        productsServices: onboardingData?.productsServices,
        brandTone: profile?.brandTone,
      };
      const res = await fetch("/api/generate-ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to generate ads");
      const data = await res.json();
      if (data.ads && data.stats) {
        setAds(data.ads); setStats(data.stats);
        toast.success("Ads & analytics generated!");
      } else throw new Error("Invalid response format");
    } catch (error: any) {
      console.warn("Generation failed:", error.message);
      toast.error("Generation failed. Check your Gemini API quota or network.");
    } finally {
      setLoading(false);
    }
  };

  const simulateDeploy = async () => {
    setDeploying(true);
    setDeployStep(0);
    for (let i = 0; i < PUBLISH_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 1200));
      setDeployStep(i + 1);
    }
    toast.success("Campaign deployed successfully via Smart Publish Engine!");
    setTimeout(() => { setDeploying(false); setDeployStep(0); }, 2000);
  };


  if (!mounted) return null;

  // Loading state
  if (loading && !ads) return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Growth & Ads</h1>
        <p className="text-zinc-500 text-sm">AI is generating your personalized ad campaigns...</p>
      </div>
      <AIThinkingState label="Generating ad campaigns, KPIs & insights..." />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Growth & Ads</h1>
          <p className="text-zinc-500 text-sm">AI-generated campaigns, budget optimizer & performance predictions</p>
        </div>
        <Button onClick={generateAds} disabled={loading} className="btn-premium text-white rounded-xl px-6">
          <Wand2 className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Generating..." : "Regenerate Ads"}
        </Button>
      </div>

      {ads && stats && (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
          {/* KPI Stats */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
              { label: "CTR", value: stats.ctr || "4.8%", icon: MousePointerClick, color: "text-blue-400", glow: "blue" },
              { label: "CPC", value: stats.cpc || "₹3.20", icon: HandCoins, color: "text-emerald-400", glow: "emerald" },
              { label: "ROAS", value: stats.roas || "5.2x", icon: TrendingUp, color: "text-purple-400", glow: "purple" },
              { label: "Conv. Rate", value: stats.conversionRate || "4.1%", icon: Target, color: "text-pink-400", glow: "pink" },
              { label: "Impressions", value: stats.impressions || "82,400", icon: Activity, color: "text-orange-400", glow: "orange" },
              { label: "Clicks", value: stats.clicks || "3,950", icon: PlayCircle, color: "text-cyan-400", glow: "cyan" },
            ].map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div key={i} whileHover={{ y: -3 }} className="glass-card rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all cursor-default">
                  <Icon className={`w-4 h-4 ${kpi.color} mb-2`} />
                  <div className={`text-xl font-bold ${kpi.color}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                    <AnimatedCounter value={kpi.value} duration={1400} />
                  </div>
                  <div className="text-xs text-zinc-600 mt-0.5">{kpi.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts row */}
          <motion.div variants={item} className="grid md:grid-cols-2 gap-5">
            {/* ROAS trend */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" />7-Day ROAS & CTR Trend</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" stroke="#52525b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#52525b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="roas" stroke="#a855f7" strokeWidth={2} dot={false} name="ROAS" />
                  <Line type="monotone" dataKey="ctr" stroke="#3b82f6" strokeWidth={2} dot={false} name="CTR %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Budget pie */}
            <div className="glass-card rounded-2xl p-5 border border-white/5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-pink-400" />Budget Allocation</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart>
                      <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                        {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {PIE_DATA.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-zinc-400 whitespace-nowrap">{d.name.split(" ")[0]}</span>
                      <span className="text-xs font-bold text-white ml-auto pl-2">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Smart Budget Optimizer */}
          <motion.div variants={item}>
            <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 orb-purple opacity-20 rounded-full blur-3xl" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"><Zap className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <h3 className="font-semibold text-white">Smart Budget Optimizer</h3>
                    <p className="text-xs text-zinc-500">Current vs AI-recommended allocation</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">+12% est. ROAS gain</Badge>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={BUDGET_DATA} barSize={14} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis dataKey="name" stroke="#52525b" tick={{ fontSize: 10 }} tickFormatter={v => v.split(" ")[0]} />
                  <YAxis stroke="#52525b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="current" name="Current %" fill="rgba(168,85,247,0.5)" radius={[4,4,0,0]} />
                  <Bar dataKey="optimized" name="Optimized %" fill="#a855f7" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* A/B Creative cards */}
          <motion.div variants={item}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              <Target className="w-5 h-5 text-purple-400" />
              Ad Campaigns
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {ads.map((ad: any, i: number) => (
                <div key={i} className="glass-card rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all duration-300 overflow-hidden group">
                  <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs">{ad.platform}</Badge>
                          <Badge className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs">{ad.goal}</Badge>
                        </div>
                        <h4 className="font-semibold text-white">{ad.headline}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-emerald-400">{ad.budget}</div>
                        <div className="text-xs text-zinc-600">budget</div>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">{ad.primaryText}</p>
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <div className="flex gap-2 text-xs">
                        <span className="text-zinc-600 shrink-0">Audience:</span>
                        <span className="text-zinc-400">{ad.audience}</span>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-zinc-600 shrink-0">Creative:</span>
                        <span className="text-zinc-400">{ad.creativeIdea}</span>
                      </div>
                    </div>
                    <Badge className="mt-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/20 text-xs px-3 py-1.5">
                      CTA: {ad.cta}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          {stats.insights && (
            <motion.div variants={item}>
              <div className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20"><Lightbulb className="w-5 h-5 text-yellow-400" /></div>
                  <h3 className="font-semibold text-white">AI Performance Insights</h3>
                </div>
                <div className="space-y-3">
                  {stats.insights.map((insight: string, i: number) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-black">{i + 1}</span>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* One-click Deploy */}
          <motion.div variants={item}>
            <div className="glass-card rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-purple-400" />
                      One-Click Campaign Deployment
                    </h3>
                    <p className="text-sm text-zinc-500 mt-1">Simulate submitting this campaign to Meta & Google Ads</p>
                  </div>
                  <Button onClick={simulateDeploy} disabled={deploying} className="btn-premium text-white rounded-xl px-8 shrink-0">
                    {deploying ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Deploying...</> : <><Zap className="w-4 h-4 mr-2" />Deploy Campaign</>}
                  </Button>
                </div>
                {deploying && (
                  <div className="mt-5 space-y-2">
                    {PUBLISH_STEPS.map((step, i) => (
                      <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i < deployStep ? "text-emerald-400" : i === deployStep - 1 ? "text-white" : "text-zinc-700"}`}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${i < deployStep ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"}`}>
                          {i < deployStep && <span className="text-[8px] text-black font-bold">✓</span>}
                        </div>
                        {step}
                      </div>
                    ))}
                  </div>

                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
