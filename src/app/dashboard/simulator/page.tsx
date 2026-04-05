"use client";

import { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Target, BarChart3, AlertTriangle, Lightbulb, Info, RefreshCw, Play, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import AnimatedCounter from "@/components/AnimatedCounter";
import AIThinkingState from "@/components/AIThinkingState";

const PLATFORMS = ["Instagram", "Facebook", "Google Search", "YouTube", "LinkedIn"];
const TOOLTIP_STYLE = { backgroundColor: "#09090b", borderColor: "rgba(255,255,255,0.06)", borderRadius: "10px", color: "#fff", fontSize: "12px" };

const container: any = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item: any = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export default function SimulatorPage() {
  const { profile, onboardingData } = useBusiness();
  const [budget, setBudget] = useState(10000);
  const [platform, setPlatform] = useState("Instagram");
  const [audienceSize, setAudienceSize] = useState(50000);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/predict-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: onboardingData?.businessName || profile?.businessName,
          businessType: onboardingData?.businessType || profile?.industry,
          targetAudience: onboardingData?.targetAudience || profile?.targetAudience,
          location: onboardingData?.location,
          productsServices: onboardingData?.productsServices,
          brandTone: profile?.brandTone,
          budget: `₹${budget.toLocaleString("en-IN")}`,
          platform,
          audienceSize: audienceSize.toLocaleString("en-IN"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
      toast.success("Performance predicted!");
    } catch {
      toast.error("Prediction failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const insightIcon = (type: string) => {
    if (type === "warning") return <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />;
    if (type === "tip") return <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
    return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
  };

  const insightStyle = (type: string) => {
    if (type === "warning") return "bg-yellow-500/8 border-yellow-500/20";
    if (type === "tip") return "bg-emerald-500/8 border-emerald-500/20";
    return "bg-blue-500/8 border-blue-500/20";
  };

  const radarData = data ? [
    { metric: "CTR", score: parseFloat(data.predictions.ctr) * 10 },
    { metric: "ROAS", score: parseFloat(data.predictions.roas) * 12 },
    { metric: "Conv. Rate", score: parseFloat(data.predictions.conversionRate) * 15 },
    { metric: "Reach", score: Math.min(100, parseInt(data.predictions.estimatedReach.replace(/,/g,"")) / 1000) },
    { metric: "Confidence", score: data.predictions.confidenceScore },
  ] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <Play className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>"What If" Simulator</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-12">Change budget, platform, audience — see live ROI predictions instantly</p>
        </div>
        <Button onClick={predict} disabled={loading} className="btn-premium text-white rounded-xl px-8">
          {loading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Predicting...</> : <><Zap className="w-4 h-4 mr-2" />Predict Performance</>}
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Adjust Variables</h2>

            {/* Budget Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-zinc-300 font-medium">Monthly Budget</label>
                <span className="text-lg font-bold text-purple-400" style={{ fontFamily: "Outfit, sans-serif" }}>
                  ₹{budget.toLocaleString("en-IN")}
                </span>
              </div>
              <Slider
                value={[budget]}
                onValueChange={(v) => setBudget(Array.isArray(v) ? (v as number[])[0] : (v as number))}
                min={1000} max={100000} step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-600">
                <span>₹1,000</span><span>₹1,00,000</span>
              </div>
            </div>

            {/* Audience Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm text-zinc-300 font-medium">Audience Size</label>
                <span className="text-lg font-bold text-blue-400" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {audienceSize.toLocaleString("en-IN")}
                </span>
              </div>
              <Slider
                value={[audienceSize]}
                onValueChange={(v) => setAudienceSize(Array.isArray(v) ? (v as number[])[0] : (v as number))}
                min={5000} max={500000} step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-600">
                <span>5K</span><span>5L</span>
              </div>
            </div>

            {/* Platform selector */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-300 font-medium">Primary Platform</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      platform === p
                        ? "bg-purple-500/20 border-purple-500/40 text-purple-200"
                        : "border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick budget presets */}
            <div className="space-y-2">
              <label className="text-xs text-zinc-600 uppercase tracking-wider">Quick Presets</label>
              <div className="grid grid-cols-3 gap-2">
                {[5000, 15000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBudget(preset)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                      budget === preset ? "bg-purple-500/20 border-purple-500/40 text-purple-300" : "border-white/8 text-zinc-500 hover:border-white/15 hover:text-zinc-300"
                    }`}
                  >
                    ₹{(preset/1000).toFixed(0)}K
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Benchmark comparison */}
          {data?.benchmarks && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 border border-white/5">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Industry Benchmark</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-400">Industry Avg CTR</span>
                  <span className="text-xs font-bold text-zinc-300">{data.benchmarks.industryAvgCTR}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-400">Industry Avg ROAS</span>
                  <span className="text-xs font-bold text-zinc-300">{data.benchmarks.industryAvgROAS}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400">Your Position</span>
                  <Badge className={`text-xs ${data.benchmarks.yourVsIndustry === "above" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"} border`}>
                    {data.benchmarks.yourVsIndustry === "above" ? "↑ Above Average" : data.benchmarks.yourVsIndustry === "below" ? "↓ Below Average" : "At Industry Par"}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3 space-y-5">
          {loading && <AIThinkingState label="Simulating performance for your inputs..." />}

          {!loading && !data && (
            <div className="glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[300px] text-center p-8">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <BarChart3 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Adjust & Predict</h3>
              <p className="text-zinc-500 text-sm max-w-xs">Set your budget, audience size, and platform — then click Predict Performance to see live results</p>
            </div>
          )}

          {data && !loading && (
            <motion.div variants={container} initial="hidden" animate="visible" className="space-y-5">
              {/* KPI grid */}
              <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Est. CTR", value: data.predictions.ctr, color: "text-blue-400" },
                  { label: "Est. ROAS", value: data.predictions.roas, color: "text-purple-400" },
                  { label: "Conv. Rate", value: data.predictions.conversionRate, color: "text-pink-400" },
                  { label: "AI Confidence", value: `${data.predictions.confidenceScore}%`, color: "text-emerald-400" },
                ].map((kpi, i) => (
                  <div key={i} className="glass-card rounded-2xl p-4 border border-white/5 text-center">
                    <div className={`text-2xl font-bold ${kpi.color}`} style={{ fontFamily: "Outfit, sans-serif" }}>
                      <AnimatedCounter value={kpi.value} duration={1000} />
                    </div>
                    <div className="text-xs text-zinc-600 mt-1">{kpi.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Revenue prediction */}
              <motion.div variants={item} className="glass-card rounded-2xl p-5 border border-purple-500/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Estimated Monthly Revenue</p>
                    <div className="text-4xl font-black text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                      <AnimatedCounter value={data.predictions.estimatedRevenue} duration={1500} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">from ₹{budget.toLocaleString("en-IN")} budget on {platform}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{data.predictions.estimatedClicks}</div>
                    <div className="text-xs text-zinc-500">Estimated Clicks</div>
                    <div className="text-2xl font-bold text-blue-400 mt-2">{data.predictions.estimatedReach}</div>
                    <div className="text-xs text-zinc-500">Estimated Reach</div>
                  </div>
                </div>
              </motion.div>

              {/* Radar chart */}
              {radarData.length > 0 && (
                <motion.div variants={item} className="glass-card rounded-2xl p-5 border border-white/5">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Performance Radar</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "#71717a", fontSize: 11 }} />
                      <Radar dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Budget breakdown */}
              {data.budgetBreakdown && (
                <motion.div variants={item} className="glass-card rounded-2xl p-5 border border-white/5">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Optimal Budget Split</h3>
                  <div className="space-y-3">
                    {data.budgetBreakdown.map((b: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-28 text-xs text-zinc-400 shrink-0">{b.platform.split(" ")[0]}</div>
                        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${b.allocation}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: ["#a855f7", "#3b82f6", "#10b981"][i] || "#6366f1" }}
                          />
                        </div>
                        <div className="w-12 text-right text-xs font-bold text-white">{b.allocation}%</div>
                        <Badge className="text-xs bg-zinc-800 border-0 text-zinc-400 shrink-0">{b.expectedROAS}</Badge>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* AI Insights */}
              {data.insights && (
                <motion.div variants={item} className="space-y-3">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">AI Insights</h3>
                  {data.insights.map((ins: any, i: number) => (
                    <div key={i} className={`flex gap-3 p-4 rounded-xl border ${insightStyle(ins.type)}`}>
                      {insightIcon(ins.type)}
                      <div className="flex-1">
                        <p className="text-sm text-zinc-300 leading-relaxed">{ins.message}</p>
                        <Badge className={`mt-2 text-xs border ${ins.impact === "High" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-zinc-700 bg-zinc-800 text-zinc-400"}`}>{ins.impact} Impact</Badge>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
