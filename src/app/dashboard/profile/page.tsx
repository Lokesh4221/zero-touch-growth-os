"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Store, Target, MessageSquare, Star, ArrowRight, PieChart as PieChartIcon, Brain, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const MOCK_DEMOGRAPHICS = [
  { name: "Gen Z (18-24)", value: 45, color: "#a855f7" },
  { name: "Millennials (25-34)", value: 35, color: "#3b82f6" },
  { name: "Gen X (35-44)", value: 15, color: "#10b981" },
  { name: "Boomers (45+)", value: 5, color: "#f59e0b" },
];

const container: any = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item: any = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 28, c = 2 * Math.PI * r;
  const dash = (score / 10) * c;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-zinc-500 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, onboardingData } = useBusiness();
  const router = useRouter();
  const [scoreVisible, setScoreVisible] = useState(false);

  useEffect(() => {
    if (!onboardingData && !profile) router.push("/");
    setTimeout(() => setScoreVisible(true), 500);
  }, [onboardingData, profile, router]);

  const completenessScore = profile ? Math.round(
    ([profile.businessName, profile.industry, profile.targetAudience, profile.brandTone, profile.usp, profile.competitors?.length > 0]
      .filter(Boolean).length / 6) * 10
  ) : 0;

  if (!profile) return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight gradient-text mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
          Analyzing Brand Context
        </h1>
        <p className="text-zinc-400">Our AI is building your comprehensive marketing profile...</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[200px] rounded-2xl shimmer" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <div className="orb orb-purple w-[400px] h-[400px] top-0 right-0 opacity-30" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight gradient-text mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            Business Profile
          </h1>
          <p className="text-zinc-500 max-w-2xl">
            How our AI understands your brand. Every strategy and campaign generated will be hyper-aligned with this identity.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-xl" onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="btn-premium text-white rounded-xl px-6" onClick={() => router.push("/dashboard/strategy")}>
            Generate Strategy <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* AI Completeness score */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>AI Profile Completeness</h2>
                <p className="text-sm text-zinc-500">Higher score = more personalized AI outputs</p>
              </div>
            </div>
            <div className="flex gap-6">
              {scoreVisible && (
                <>
                  <ScoreRing score={completenessScore} label="Profile Score" color="#a855f7" />
                  <ScoreRing score={8} label="Brand Clarity" color="#3b82f6" />
                  <ScoreRing score={7} label="Market Fit" color="#10b981" />
                  <ScoreRing score={9} label="AI Confidence" color="#ec4899" />
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item}>
              <div className="glass-card rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all duration-300 h-full p-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 ring-1 ring-blue-500/20"><Store className="w-5 h-5" /></div>
                  <h3 className="font-semibold text-zinc-100">Brand Identity</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-semibold">Business Name</p>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>{profile.businessName || onboardingData?.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-widest font-semibold">Industry</p>
                    <Badge className="bg-blue-500/10 text-blue-200 border border-blue-500/20 rounded-lg">{profile.industry}</Badge>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="glass-card rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all duration-300 h-full p-6 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 ring-1 ring-purple-500/20"><Target className="w-5 h-5" /></div>
                  <h3 className="font-semibold text-zinc-100">Targeting</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-semibold">Primary Audience</p>
                    <p className="text-zinc-300 leading-relaxed text-sm">{profile.targetAudience}</p>
                  </div>
                  {onboardingData?.location && (
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest font-semibold">Location</p>
                      <p className="text-purple-200 font-medium">{onboardingData.location}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={item}>
            <div className="glass-card rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all duration-300 p-6 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 ring-1 ring-emerald-500/20"><Star className="w-5 h-5" /></div>
                <h3 className="font-semibold text-zinc-100">Unique Selling Proposition</h3>
              </div>
              <p className="text-xl text-emerald-50 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2">
                "{profile.usp}"
              </p>
            </div>
          </motion.div>

          {/* Brand Voice Memory */}
          <motion.div variants={item}>
            <div className="glass-card rounded-2xl border border-white/5 hover:border-pink-500/20 transition-all duration-300 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 ring-1 ring-pink-500/20"><Zap className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Brand Voice Memory</h3>
                    <p className="text-xs text-zinc-500">AI remembers this tone across all generated content</p>
                  </div>
                  <Badge className="ml-auto bg-pink-500/10 text-pink-300 border border-pink-500/20 text-xs">Active</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Tone</p>
                    <p className="text-white font-semibold capitalize">{profile.brandTone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Sample Copy</p>
                    <p className="text-sm text-zinc-300 italic">"{profile.usp?.split(".")[0] || `Experience the best of ${profile.businessName}`}"</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <div className="glass-card rounded-2xl border border-white/5 hover:border-rose-500/20 transition-all duration-300 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 ring-1 ring-rose-500/20"><Store className="w-5 h-5" /></div>
                <h3 className="font-semibold text-zinc-100">Key Competitors</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.competitors?.map((comp: string, i: number) => (
                  <Badge key={i} variant="outline" className="border-rose-500/30 text-rose-200 bg-rose-500/10 px-3 py-1.5 rounded-lg">{comp}</Badge>
                ))}
                {(!profile.competitors || profile.competitors.length === 0) && (
                  <p className="text-zinc-500 text-sm">No competitors identified.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right col - demographics */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="glass-card rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all h-full p-6 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="mb-4">
              <div className="flex items-center gap-2 text-indigo-400 mb-1">
                <PieChartIcon className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Demographics</span>
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Audience Breakdown</h3>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full aspect-square max-h-[260px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={MOCK_DEMOGRAPHICS} cx="50%" cy="50%" innerRadius={70} outerRadius={100} stroke="none" paddingAngle={4} dataKey="value">
                      {MOCK_DEMOGRAPHICS.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "rgba(255,255,255,0.06)", borderRadius: "12px", color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-white">45%</span>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Primary</span>
                </div>
              </div>
              <div className="w-full mt-4 space-y-2">
                {MOCK_DEMOGRAPHICS.map((demo, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: demo.color }} />
                      <span className="text-xs text-zinc-400">{demo.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{demo.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
