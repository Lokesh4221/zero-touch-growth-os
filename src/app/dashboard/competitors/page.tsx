"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCompare, Zap, TrendingDown, TrendingUp, Target, RefreshCw, ShieldAlert, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export default function CompetitorsPage() {
  const { profile, onboardingData } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && !data) analyze();
  }, [profile]);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: onboardingData?.businessName || profile?.businessName,
          businessType: onboardingData?.businessType || profile?.industry,
          competitors: profile?.competitors,
          usp: profile?.usp,
          targetAudience: onboardingData?.targetAudience || profile?.targetAudience,
          location: onboardingData?.location,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
      toast.success("Competitor analysis ready!");
    } catch {
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const impactColor = (impact: string) =>
    impact === "High" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    : impact === "Medium" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
    : "text-zinc-400 bg-zinc-500/10 border-zinc-500/30";

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-zinc-500">Complete onboarding first to use Competitor Analysis.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <GitCompare className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Competitor Intelligence</h1>
          </div>
          <p className="text-zinc-500 text-sm ml-12">AI-powered analysis of your market landscape and gap opportunities</p>
        </div>
        <Button onClick={analyze} disabled={loading} className="btn-premium text-white rounded-xl px-6">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Analyzing..." : "Re-analyze"}
        </Button>
      </div>

      {loading && !data && (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl shimmer" />
          ))}
        </div>
      )}

      {data && (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
          {/* Competitive Score */}
          <motion.div variants={item}>
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Your Competitive Score</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(data.competitiveScore || {}).map(([key, val]: any) => (
                  <div key={key} className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>{val}</div>
                    <div className="text-xs text-zinc-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Competitors */}
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Competitor Breakdown</h2>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
              {(data.competitorAnalysis || []).map((comp: any, i: number) => (
                <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">{comp.pricingStrategy}</Badge>
                        <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">{comp.contentTone}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{comp.audienceFit}</div>
                      <div className="text-xs text-zinc-500">Audience Fit</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-zinc-500 mb-0.5">Strength</p>
                        <p className="text-sm text-zinc-300">{comp.strength}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <TrendingDown className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-zinc-500 mb-0.5">Gap / Weakness</p>
                        <p className="text-sm text-zinc-300">{comp.weakness}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                    {(comp.platforms || []).map((p: string, j: number) => (
                      <Badge key={j} className="bg-zinc-800 text-zinc-300 border-0 text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Opportunity Gaps */}
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Your Opportunity Gaps
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {(data.opportunityGaps || []).map((gap: any, i: number) => (
                <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 hover:border-yellow-500/20 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl" />
                  <Badge className={`text-xs mb-3 border ${impactColor(gap.impact)}`}>{gap.impact} Impact</Badge>
                  <h3 className="font-bold text-white mb-2">{gap.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{gap.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
