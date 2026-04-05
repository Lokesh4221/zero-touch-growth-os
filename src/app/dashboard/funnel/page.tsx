"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, RefreshCw, Target, Megaphone, ShoppingCart, ChevronRight, BarChart3, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };
const item = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const STAGE_COLORS = [
  { glow: "from-blue-500/20 to-purple-500/20", border: "border-blue-500/30", icon: "text-blue-400", bar: "bg-blue-500", label: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
  { glow: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/30", icon: "text-purple-400", bar: "bg-purple-500", label: "bg-purple-500/10 border-purple-500/20 text-purple-300" },
  { glow: "from-pink-500/20 to-rose-500/20", border: "border-rose-500/30", icon: "text-rose-400", bar: "bg-gradient-to-r from-pink-500 to-rose-500", label: "bg-rose-500/10 border-rose-500/20 text-rose-300" },
];

const STAGE_ICONS = [Target, Megaphone, ShoppingCart];

export default function FunnelPage() {
  const { profile, onboardingData } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && !data) generate();
  }, [profile]);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: onboardingData?.businessName || profile?.businessName,
          businessType: onboardingData?.businessType || profile?.industry,
          targetAudience: onboardingData?.targetAudience || profile?.targetAudience,
          location: onboardingData?.location,
          productsServices: onboardingData?.productsServices,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
      toast.success("Funnel generated!");
    } catch {
      toast.error("Failed to generate funnel. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-500">Complete onboarding first to use Funnel Builder.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <TrendingUp className="w-5 h-5 text-rose-400" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>AI Funnel Builder</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-12">Awareness → Consideration → Conversion — built for your brand</p>
        </div>
        <Button onClick={generate} disabled={loading} className="btn-premium text-white rounded-xl px-6">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Building..." : "Rebuild Funnel"}
        </Button>
      </div>

      {loading && !data && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-56 rounded-2xl shimmer" />)}
        </div>
      )}

      {data && (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
          {/* Overview stats */}
          <motion.div variants={item} className="grid grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-white/5 text-center">
              <BarChart3 className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold gradient-text" style={{ fontFamily: "Outfit, sans-serif" }}>{data.estimatedROAS}</div>
              <div className="text-xs text-zinc-500 mt-1">Estimated ROAS</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-white/5 text-center">
              <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-400" style={{ fontFamily: "Outfit, sans-serif" }}>{data.totalBudgetSuggestion}</div>
              <div className="text-xs text-zinc-500 mt-1">Suggested Budget</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-white/5 text-center">
              <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: "Outfit, sans-serif" }}>{data.timeToResults}</div>
              <div className="text-xs text-zinc-500 mt-1">Time to Results</div>
            </div>
          </motion.div>

          {/* Visual funnel */}
          <motion.div variants={item} className="glass-card rounded-2xl p-6 border border-white/5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Budget Allocation</h2>
            <div className="flex items-end gap-2 h-20 mb-2">
              {(data.funnel || []).map((stage: any, i: number) => {
                const colors = STAGE_COLORS[i] || STAGE_COLORS[0];
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xs text-zinc-400 font-bold">{stage.budgetPercent}%</span>
                    <div
                      className={`w-full rounded-t-xl ${colors.bar} transition-all duration-1000`}
                      style={{ height: `${stage.budgetPercent * 1.8}px` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              {(data.funnel || []).map((stage: any, i: number) => {
                const colors = STAGE_COLORS[i] || STAGE_COLORS[0];
                return (
                  <div key={i} className={`flex-1 text-center text-xs font-medium px-2 py-1 rounded-lg border ${colors.label}`}>
                    {stage.stage}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Stage cards */}
          <div className="space-y-4">
            {(data.funnel || []).map((stage: any, i: number) => {
              const colors = STAGE_COLORS[i] || STAGE_COLORS[0];
              const StageIcon = STAGE_ICONS[i] || Target;
              return (
                <motion.div key={i} variants={item}>
                  <div className={`glass-card rounded-2xl border ${colors.border} overflow-hidden group hover:shadow-lg transition-all duration-300`}>
                    <div className={`bg-gradient-to-r ${colors.glow} p-5 border-b border-white/5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`text-3xl`}>{stage.emoji}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{stage.stage}</h3>
                              <Badge className={`text-xs border ${colors.label}`}>{stage.budgetPercent}% Budget</Badge>
                            </div>
                            <p className="text-sm text-zinc-400 mt-0.5">{stage.goal}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${colors.icon}`}>{stage.targetReach}</div>
                          <div className="text-xs text-zinc-500">Est. Reach</div>
                        </div>
                      </div>
                      <div className="mt-4 glass-card rounded-xl px-4 py-3 border border-white/10">
                        <p className="text-xs text-zinc-500 mb-1">AI Copy Hook</p>
                        <p className="text-sm text-white italic">"{stage.copyHook}"</p>
                      </div>
                    </div>
                    <div className="p-5 grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Platforms</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(stage.platforms || []).map((p: string, j: number) => (
                            <Badge key={j} className="bg-zinc-800 border-0 text-zinc-300 text-xs">{p}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Content Ideas</p>
                        <ul className="space-y-1">
                          {(stage.contentIdeas || []).map((idea: string, j: number) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-zinc-400">
                              <ChevronRight className={`w-3 h-3 mt-0.5 shrink-0 ${colors.icon}`} />
                              {idea}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">KPIs to Track</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(stage.kpis || []).map((kpi: string, j: number) => (
                            <Badge key={j} variant="outline" className={`text-xs border ${colors.label}`}>{kpi}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
