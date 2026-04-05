"use client";

import { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, CheckCircle2, BarChart3, FileText, TrendingUp, Target, HandCoins, RefreshCw, ChevronRight, Zap, Download } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AIThinkingState from "@/components/AIThinkingState";

const container: any = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.09 } } };
const item: any = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const TOOLTIP_STYLE = { backgroundColor: "#09090b", borderColor: "rgba(255,255,255,0.06)", borderRadius: "10px", color: "#fff", fontSize: "12px" };
const COLORS = ["#a855f7", "#3b82f6", "#10b981", "#f59e0b"];
const WEEK_COLORS = ["border-t-blue-500", "border-t-purple-500", "border-t-pink-500", "border-t-emerald-500"];

export default function CampaignPage() {
  const { profile, onboardingData } = useBusiness();
  const [budget, setBudget] = useState("₹25,000");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: onboardingData?.businessName || profile?.businessName,
          businessType: onboardingData?.businessType || profile?.industry,
          targetAudience: onboardingData?.targetAudience || profile?.targetAudience,
          location: onboardingData?.location,
          productsServices: onboardingData?.productsServices,
          brandTone: profile?.brandTone,
          totalBudget: budget,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
      toast.success("Full campaign generated!");
    } catch {
      toast.error("Generation failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Rocket className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>One-Click Campaign</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-12">Generate a complete, interconnected 4-week campaign plan instantly</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Budget:</span>
            <Input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-32 h-9 bg-zinc-900 border-zinc-700 text-white text-sm rounded-xl"
              placeholder="₹25,000"
            />
          </div>
          <Button onClick={generate} disabled={loading} className="btn-premium text-white rounded-xl px-6">
            {loading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Rocket className="w-4 h-4 mr-2" />Generate Campaign</>}
          </Button>
        </div>
      </div>

      {loading && <AIThinkingState label="Building your complete 4-week campaign plan..." />}

      {!loading && !data && (
        <div className="glass-card rounded-3xl border border-white/5 flex flex-col items-center justify-center min-h-[380px] p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
          <div className="relative">
            <div className="flex justify-center gap-3 mb-6">
              {[FileText, BarChart3, Target, TrendingUp, HandCoins].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 rounded-xl glass-card border border-white/5"
                >
                  <Icon className="w-5 h-5 text-purple-400" />
                </motion.div>
              ))}
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>Everything in One Click</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-2">Set your budget and generate your complete Strategy + Content Plan + Ads + Funnel + Budget allocation simultaneously</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Strategy", "Content Plan", "Ad Copy", "Funnel", "Budget Split", "KPIs"].map((tag) => (
                <Badge key={tag} className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {data && !loading && (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
          {/* Campaign name banner */}
          <motion.div variants={item} className="glass-card rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/8 to-blue-500/5" />
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)" }} />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-1">Campaign Generated</p>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{data.campaignName}</h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-zinc-800 border-0 text-zinc-300 text-xs">{data.strategy.duration}</Badge>
                  <Badge className="bg-zinc-800 border-0 text-zinc-300 text-xs">{data.strategy.primaryGoal}</Badge>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div><div className="text-2xl font-bold text-purple-400">{data.kpis.expectedROAS}</div><div className="text-xs text-zinc-500">Exp. ROAS</div></div>
                <div><div className="text-2xl font-bold text-blue-400">{data.kpis.expectedConversions}</div><div className="text-xs text-zinc-500">Conversions</div></div>
                <div><div className="text-2xl font-bold text-emerald-400">{data.kpis.expectedReach}</div><div className="text-xs text-zinc-500">Reach</div></div>
              </div>
            </div>
            <div className="relative mt-4 p-4 rounded-xl bg-white/3 border border-white/5 italic">
              <p className="text-sm text-zinc-400">"{data.strategy.keyMessage}"</p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Content Plan */}
            <motion.div variants={item} className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />4-Week Content Plan
              </h3>
              {(data.contentPlan || []).map((week: any, i: number) => (
                <div key={i} className={`glass-card rounded-xl p-4 border border-white/5 border-t-2 ${WEEK_COLORS[i]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase">Week {week.week}</span>
                      <Badge className={`text-xs ${i === 3 ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 border" : "bg-zinc-800 border-0 text-zinc-400"}`}>{week.focus}</Badge>
                    </div>
                    <span className="text-xs text-zinc-500">{week.posts} posts</span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">{week.theme}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {(week.formats || []).map((f: string, j: number) => (
                      <Badge key={j} className="text-xs bg-zinc-800 border-0 text-zinc-400">{f}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Budget + Funnel */}
            <div className="space-y-5">
              {/* Budget Pie */}
              <motion.div variants={item} className="glass-card rounded-2xl p-5 border border-white/5">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <HandCoins className="w-4 h-4 text-emerald-400" />Budget Split
                </h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={data.budgetAllocation || []} dataKey="percent" nameKey="channel" cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} stroke="none">
                      {(data.budgetAllocation || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {(data.budgetAllocation || []).map((b: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs text-zinc-400">{b.channel}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-white">{b.amount}</span>
                        <span className="text-xs text-zinc-600">({b.percent}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Funnel mini */}
              <motion.div variants={item} className="glass-card rounded-2xl p-5 border border-white/5">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />Funnel Snapshot
                </h3>
                <div className="space-y-2">
                  {[
                    { key: "awareness", label: "Awareness", color: "border-blue-500 bg-blue-500/10 text-blue-300", width: "w-full" },
                    { key: "consideration", label: "Consideration", color: "border-purple-500 bg-purple-500/10 text-purple-300", width: "w-[75%]" },
                    { key: "conversion", label: "Conversion", color: "border-rose-500 bg-rose-500/10 text-rose-300", width: "w-[50%]" },
                  ].map((stage) => {
                    const stageData = data.funnel?.[stage.key];
                    return (
                      <div key={stage.key} className={`${stage.width} mx-auto rounded-xl p-3 border ${stage.color}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold">{stage.label}</span>
                          <span className="text-xs opacity-70">{stageData?.budget}</span>
                        </div>
                        <p className="text-xs opacity-60 mt-0.5">{stageData?.kpi}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Ad Campaign Box */}
          <motion.div variants={item} className="glass-card rounded-2xl p-6 border border-blue-500/15 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)" }} />
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-white">Ad Creative Snapshot</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Headline</p>
                  <p className="text-white font-bold">{data.adCampaign?.headline}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Ad Copy</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{data.adCampaign?.primaryText}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(data.adCampaign?.platforms || []).map((p: string, i: number) => (
                    <Badge key={i} className="bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs">{p}</Badge>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-1">CTA</p>
                  <Badge className="btn-premium text-white text-sm px-4 py-1.5 rounded-xl">{data.adCampaign?.cta}</Badge>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Weekly Budget</p>
                  <p className="font-bold text-emerald-400">{data.adCampaign?.budget}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
