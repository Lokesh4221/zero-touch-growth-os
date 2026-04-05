"use client";

import { useState, useEffect, useRef } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2, RefreshCw, CheckCircle2, Rocket, Eye, Share2, Play, ChevronRight,
  ChevronLeft, Heart, MessageCircle, Bookmark, Send, MoreHorizontal,
  TrendingUp, MousePointerClick, Activity, Zap, Star, Edit3, Video, Image, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import AIThinkingState from "@/components/AIThinkingState";
import AnimatedCounter from "@/components/AnimatedCounter";
import { PUBLISH_STEPS, generateSimulationMetrics, generatePlatformId } from "@/lib/simulation";


const PLATFORMS = ["Instagram Feed", "Instagram Reel", "Instagram Story", "Facebook Feed"];
const GOALS = ["Brand Awareness", "Website Traffic", "Sales", "App Downloads", "Lead Generation"];
const STYLES = ["Bold & Modern", "Minimal & Clean", "Lifestyle & Warm", "Luxury & Premium", "Playful & Fun"];

const container: any = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item: any = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } };

// ──────────────── AD CREATIVE CARD ────────────────
function AdCreativeCard({ ad, businessName, selected, onSelect }: { ad: any; businessName: string; selected: boolean; onSelect: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        selected ? "border-purple-500 shadow-[0_0_24px_rgba(168,85,247,0.3)]" : "border-white/8 hover:border-white/20"
      }`}
    >
      {/* Ad Creative Visual */}
      <div className={`relative h-52 bg-gradient-to-br ${ad.bgGradient} flex flex-col items-center justify-center p-6 overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        {/* Brand badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold">
          {businessName}
        </div>

        {/* Format badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/10 border-white/20 text-white text-[10px] flex items-center gap-1">
            {ad.format === "Reel" ? <Video className="w-2.5 h-2.5" /> : <Image className="w-2.5 h-2.5" />}
            {ad.format}
          </Badge>
        </div>

        {/* Content */}
        <div className="text-6xl mb-3">{ad.emoji}</div>
        <div className="text-center">
          <h3 className="text-white font-black text-lg leading-tight text-center" style={{ fontFamily: "Outfit, sans-serif", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
            {ad.headline}
          </h3>
          <p className="text-white/70 text-xs mt-1 text-center">{ad.subheadline}</p>
        </div>

        {/* CTA button */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white text-xs font-bold" style={{ color: ad.accentColor }}>
          {ad.cta}
        </div>

        {/* Selected check */}
        {selected && (
          <div className="absolute bottom-3 left-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Ad Metadata */}
      <div className="p-4 bg-zinc-900 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="text-xs bg-zinc-800 border-0 text-zinc-400">{ad.hook}</Badge>
          <Badge className={`text-xs border ${ad.audienceMatch === "Very High" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-blue-500/10 text-blue-300 border-blue-500/20"}`}>
            {ad.audienceMatch} Match
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-bold text-white">{ad.estimatedCTR}</div>
            <div className="text-[10px] text-zinc-600">Est. CTR</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">{ad.estimatedROAS}</div>
            <div className="text-[10px] text-zinc-600">Est. ROAS</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">{ad.confidence}%</div>
            <div className="text-[10px] text-zinc-600">Confidence</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────── INSTAGRAM PREVIEW ────────────────
function InstagramPreview({ ad, businessName, previewMode }: { ad: any; businessName: string; previewMode: string }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likes = Math.floor(Math.random() * 800) + 200;
  const isStory = previewMode === "Instagram Story";
  const isReel = previewMode === "Instagram Reel";

  if (isStory) {
    return (
      <div className="relative w-64 h-[460px] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Story background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${ad.bgGradient}`} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        {/* Progress bar */}
        <div className="absolute top-3 left-3 right-3 flex gap-1">
          <div className="h-0.5 bg-white/40 rounded-full flex-1"><div className="h-full bg-white rounded-full w-full" /></div>
          <div className="h-0.5 bg-white/20 rounded-full flex-1" />
          <div className="h-0.5 bg-white/20 rounded-full flex-1" />
        </div>
        {/* Header */}
        <div className="absolute top-7 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">{businessName[0]}</div>
            <div>
              <p className="text-white text-xs font-semibold">{businessName}</p>
              <p className="text-white/50 text-[9px]">Sponsored</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-white/70" />
        </div>
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-4">{ad.emoji}</div>
          <h2 className="text-white font-black text-2xl leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>{ad.headline}</h2>
          <p className="text-white/70 text-sm mt-2">{ad.subheadline}</p>
        </div>
        {/* CTA swipe */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1">
          <div className="text-white/50 text-xs">Swipe Up</div>
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <ChevronRight className="w-4 h-4 rotate-90" style={{ color: ad.accentColor }} />
          </div>
          <div className="mt-2 px-6 py-2.5 rounded-full font-bold text-sm" style={{ background: ad.accentColor, color: "white" }}>
            {ad.cta}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-72 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-950">
      {/* iPhone notch feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-10" />

      {/* Reel/Feed header */}
      <div className="flex items-center px-3 py-3 mt-4 gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
          <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold text-white">{businessName[0]}</div>
        </div>
        <div className="flex-1">
          <p className="text-white text-xs font-semibold leading-tight">{businessName.toLowerCase().replace(/\s/g, "_")}</p>
          <p className="text-zinc-500 text-[9px]">Sponsored · {isReel ? "Reel" : "Instagram"}</p>
        </div>
        <MoreHorizontal className="w-4 h-4 text-zinc-400" />
      </div>

      {/* Creative */}
      <div className={`relative h-52 bg-gradient-to-br ${ad.bgGradient} flex flex-col items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px)", backgroundSize: "25px 25px" }} />
        {isReel && <div className="absolute top-3 right-3"><Play className="w-5 h-5 text-white fill-white" /></div>}
        <div className="text-5xl mb-2">{ad.emoji}</div>
        <h3 className="text-white font-black text-base text-center px-4" style={{ fontFamily: "Outfit, sans-serif" }}>{ad.headline}</h3>
        <p className="text-white/60 text-xs mt-1 text-center px-6">{ad.subheadline}</p>

        {/* CTA overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-end">
          <div className="px-3 py-1.5 rounded-lg bg-white font-bold text-xs" style={{ color: ad.accentColor }}>{ad.cta}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-2 flex items-center gap-4">
        <button onClick={() => setLiked(!liked)}>
          <Heart className={`w-5 h-5 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-zinc-300"}`} />
        </button>
        <MessageCircle className="w-5 h-5 text-zinc-300" />
        <Send className="w-5 h-5 text-zinc-300" />
        <button onClick={() => setSaved(!saved)} className="ml-auto">
          <Bookmark className={`w-5 h-5 transition-colors ${saved ? "fill-white text-white" : "text-zinc-300"}`} />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-3 pb-4 space-y-1.5">
        <p className="text-white text-xs font-semibold">{(liked ? likes + 1 : likes).toLocaleString()} likes</p>
        <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2">
          <span className="text-white font-semibold">{businessName.toLowerCase().replace(/\s/g, "_")} </span>
          {ad.caption}
        </p>
        {/* CTA button */}
        <div className="mt-2 w-full py-2 rounded-lg text-center text-xs font-bold" style={{ background: `${ad.accentColor}22`, color: ad.accentColor, border: `1px solid ${ad.accentColor}44` }}>
          {ad.cta} →
        </div>
      </div>
    </div>
  );
}

// ──────────────── LIVE METRICS ────────────────
function LiveMetrics({ adName, platform }: { adName: string; platform: string }) {
  const [metrics, setMetrics] = useState({ impressions: 0, clicks: 0, reach: 0, engagement: 0 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const targets = { impressions: 4820, clicks: 213, reach: 3940, engagement: 8.7 };
    const intervalId = setInterval(() => {
      setMetrics(prev => ({
        impressions: Math.min(targets.impressions, prev.impressions + Math.floor(Math.random() * 180 + 40)),
        clicks: Math.min(targets.clicks, prev.clicks + Math.floor(Math.random() * 12 + 3)),
        reach: Math.min(targets.reach, prev.reach + Math.floor(Math.random() * 140 + 30)),
        engagement: Math.min(targets.engagement, +(prev.engagement + 0.3).toFixed(1)),
      }));
      setTick(t => t + 1);
    }, 600);
    return () => clearInterval(intervalId);
  }, []);

  const METRIC_CARDS = [
    { label: "Impressions", value: metrics.impressions.toLocaleString("en-IN"), icon: Eye, color: "text-blue-400", bg: "blue" },
    { label: "Clicks", value: metrics.clicks.toLocaleString("en-IN"), icon: MousePointerClick, color: "text-purple-400", bg: "purple" },
    { label: "Reach", value: metrics.reach.toLocaleString("en-IN"), icon: TrendingUp, color: "text-emerald-400", bg: "emerald" },
    { label: "Engagement", value: `${metrics.engagement}%`, icon: Activity, color: "text-pink-400", bg: "pink" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Success banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)" }} />
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Ad Published Successfully!</h3>
            <p className="text-emerald-400 text-sm">"{adName}" is now live on {platform}</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 live-dot" />
            <span className="text-xs text-emerald-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Live metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Live Performance</h3>
          <div className="ml-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-600">updating live</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRIC_CARDS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={i}
                animate={{ scale: tick > 0 && i === tick % 4 ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl p-4 border border-white/5 text-center group"
              >
                <Icon className={`w-4 h-4 ${m.color} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${m.color} tabular-nums`} style={{ fontFamily: "Outfit, sans-serif" }}>
                  {m.value}
                </div>
                <div className="text-xs text-zinc-600 mt-1">{m.label}</div>
                <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.random() * 40 + 40}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: { blue: "#3b82f6", purple: "#a855f7", emerald: "#10b981", pink: "#ec4899" }[m.bg] || "#a855f7" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Reach estimate */}
      <div className="glass-card rounded-2xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Projected 7-Day Performance</h3>
          <Badge className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs">AI Forecast</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><div className="text-xl font-bold text-white">34,700+</div><div className="text-xs text-zinc-500">Total Reach</div></div>
          <div><div className="text-xl font-bold text-purple-400">₹4.8x</div><div className="text-xs text-zinc-500">Projected ROAS</div></div>
          <div><div className="text-xl font-bold text-emerald-400">420+</div><div className="text-xs text-zinc-500">Conversions</div></div>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────── MAIN PAGE ────────────────
const STEPS = ["Configure", "Generate", "Preview & Select", "Publish"];

export default function CreateAdPage() {
  const { profile, onboardingData } = useBusiness();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<any[]>([]);
  const [videoScript, setVideoScript] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState("Instagram Feed");
  const [publishPlatform, setPublishPlatform] = useState("Instagram Feed");
  const [publishing, setPublishing] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [platform, setPlatform] = useState("Instagram Feed");

  const [config, setConfig] = useState({
    adGoal: "Sales", style: "Bold & Modern", budget: "₹5,000",
  });

  // Track what inputs were used when ads were last generated
  const [lastGeneratedHash, setLastGeneratedHash] = useState<string | null>(null);

  const businessName = onboardingData?.businessName || profile?.businessName || "Your Brand";
  const selectedAd = variations.find(v => v.id === selectedId);

  // Compute a hash of current inputs to detect staleness
  const currentInputHash = `${config.budget}-${config.adGoal}-${config.style}-${platform}`;
  const isStale = !!lastGeneratedHash && lastGeneratedHash !== currentInputHash && variations.length > 0;

  const generate = async () => {
    setLoading(true);
    setVariations([]);
    setVideoScript(null);
    setSelectedId(null);
    try {
      const res = await fetch("/api/generate-creatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          businessType: onboardingData?.businessType || profile?.industry,
          targetAudience: onboardingData?.targetAudience || profile?.targetAudience,
          location: onboardingData?.location,
          productsServices: onboardingData?.productsServices,
          brandTone: profile?.brandTone,
          platform,
          sessionSeed: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...config,
        }),
        // Prevent browser caching
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setVariations(json.variations || []);
      setVideoScript(json.videoScript);
      setSelectedId(json.variations?.[0]?.id || null);
      setLastGeneratedHash(currentInputHash);
      setStep(2);
      toast.success("3 fresh ad creatives generated!");
    } catch {
      toast.error("Generation failed. Please retry.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const publish = async () => {
    if (!selectedAd) return;
    setPublishing(true);
    setDeployStep(0);
    
    // Multi-step publish simulation
    for (let i = 0; i < PUBLISH_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 1200));
      setDeployStep(i + 1);
    }

    const postId = generatePlatformId(publishPlatform);
    const metrics = generateSimulationMetrics(config.budget, onboardingData?.targetAudience || profile?.targetAudience, 0.9);
    
    setPublishing(false);
    setPublished(true);
    setStep(3);
    toast.success(`Ad published to ${publishPlatform} with ID: ${postId}`);
  };


  // Helper: update config and mark current ads stale
  const updateConfig = (patch: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...patch }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Wand2 className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Ad Studio</h1>
          <Badge className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 text-xs ml-1">
            ✦ Create → Preview → Publish
          </Badge>
        </div>
        <p className="text-zinc-500 text-sm ml-12">AI generates your ad creatives. You approve. One click publishes to Instagram & Facebook.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => { if (i < step || (i === 2 && variations.length > 0)) setStep(i); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                step === i ? "bg-purple-600 text-white" : i < step ? "text-purple-400 border border-purple-500/30 bg-purple-500/8" : "text-zinc-600"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                step === i ? "bg-white text-purple-600 border-transparent" : i < step ? "bg-purple-500/20 border-purple-500/40 text-purple-400" : "border-zinc-700 text-zinc-600"
              }`}>
                {i < step ? "✓" : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── STEP 0: Configure ── */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-5">
              <h2 className="font-semibold text-white">Campaign Configuration</h2>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Ad Goal</label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => updateConfig({ adGoal: g })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${config.adGoal === g ? "bg-purple-500/20 border-purple-500/40 text-purple-200" : "border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Target Platform</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => setPlatform(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${platform === p ? "bg-blue-500/20 border-blue-500/40 text-blue-200" : "border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Visual Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(s => (
                    <button key={s} onClick={() => updateConfig({ style: s })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${config.style === s ? "bg-pink-500/20 border-pink-500/40 text-pink-200" : "border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 font-medium">Ad Budget</label>
                <div className="flex flex-wrap gap-2">
                  {["₹2,000", "₹5,000", "₹10,000", "₹25,000", "₹50,000"].map(b => (
                    <button key={b} onClick={() => updateConfig({ budget: b })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${config.budget === b ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200" : "border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15"}`}>
                      {b}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 mt-1">
                  {config.budget <= "₹3,000" ? "Micro budget → simple, relatable ads" :
                   config.budget <= "₹15,000" ? "Mid budget → professional, polished ads" :
                   "Premium budget → high-production, luxury ads"}
                </p>
              </div>

              <div className="pt-2">
                <Button onClick={() => { setStep(1); generate(); }} className="btn-premium text-white w-full rounded-xl py-3 font-semibold">
                  <Wand2 className="w-4 h-4 mr-2" />Generate AI Ad Creatives
                </Button>
              </div>
            </div>

            {/* Preview of business */}
            <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
              <h2 className="font-semibold text-white">Your Brand Context</h2>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-xl font-black text-white">
                  {businessName[0]}
                </div>
                <div>
                  <p className="text-white font-bold">{businessName}</p>
                  <p className="text-xs text-zinc-500">{onboardingData?.businessType || profile?.industry}</p>
                </div>
              </div>
              {[
                { label: "Audience", value: onboardingData?.targetAudience || profile?.targetAudience },
                { label: "Location", value: onboardingData?.location },
                { label: "Brand Tone", value: profile?.brandTone },
              ].filter(f => f.value).map((f, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs text-zinc-600 w-20 shrink-0">{f.label}</span>
                  <span className="text-xs text-zinc-300">{f.value}</span>
                </div>
              ))}
              <div className="border-t border-white/5 pt-4">
                <div className="flex flex-wrap gap-2">
                  {[config.adGoal, config.style, config.budget].map((tag, i) => (
                    <Badge key={i} className="bg-zinc-800 border-0 text-zinc-400 text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 1: Generating ── */}
        {step === 1 && loading && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card rounded-2xl p-8 border border-white/5">
              <AIThinkingState label="Designing 3 AI ad creatives for your brand..." />
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Preview & Select ── */}
        {step === 2 && variations.length > 0 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">

            {/* ── Staleness banner: shown when inputs changed after generation ── */}
            <AnimatePresence>
              {isStale && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl border border-yellow-500/30 bg-yellow-500/8"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <p className="text-sm text-yellow-300 font-medium">
                      Your inputs changed — these ads no longer match your current settings
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => { setStep(1); generate(); }}
                    className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-200 hover:bg-yellow-500/30 text-xs rounded-xl shrink-0"
                  >
                    <RefreshCw className="w-3 h-3 mr-1.5" />Regenerate Ads
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Select Your Ad Creative</h2>
                <p className="text-xs text-zinc-500 mt-0.5">{config.adGoal} · {platform} · {config.budget} · {config.style}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { setStep(1); generate(); }}
                className="border-zinc-700 text-zinc-400 hover:text-white text-xs rounded-xl">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />Regenerate Fresh
              </Button>
            </div>

            {/* Variation cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {variations.map(ad => (
                <AdCreativeCard key={ad.id} ad={ad} businessName={businessName} selected={selectedId === ad.id} onSelect={() => setSelectedId(ad.id)} />
              ))}
            </div>

            {/* Preview area */}
            {selectedAd && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Preview frame selector */}
                <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Preview On Platform</h3>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map(p => (
                      <button key={p} onClick={() => setPreviewMode(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${previewMode === p ? "bg-purple-500/20 border-purple-500/40 text-purple-200" : "border-white/8 text-zinc-500 hover:text-zinc-300"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center pt-2">
                    <InstagramPreview ad={selectedAd} businessName={businessName} previewMode={previewMode} />
                  </div>
                </div>

                {/* Ad details */}
                <div className="space-y-4">
                  <div className="glass-card rounded-2xl p-5 border border-white/5 space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Ad Copy</h3>
                    <div>
                      <p className="text-xs text-zinc-600 mb-1">Headline</p>
                      <p className="text-white font-bold">{selectedAd.headline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-600 mb-1">Primary Text</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{selectedAd.primaryText}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-600 mb-1">Caption</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{selectedAd.caption}</p>
                    </div>
                  </div>

                  {/* Video script */}
                  {videoScript && (
                    <div className="glass-card rounded-2xl p-5 border border-purple-500/15 space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-semibold text-white">AI Reel Script</h3>
                      </div>
                      <div className="space-y-2">
                        {(videoScript.scenes || []).map((scene: any, i: number) => (
                          <div key={i} className="flex gap-3 p-2.5 rounded-lg bg-zinc-900/50 border border-white/5">
                            <span className="text-[10px] text-purple-400 font-bold shrink-0 w-12">{scene.time}</span>
                            <div>
                              <p className="text-xs text-zinc-400">{scene.visual}</p>
                              <p className="text-xs text-zinc-600 italic mt-0.5">"{scene.audio}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-600">🎵 {videoScript.music}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Publish panel */}
            {selectedAd && (
              <div className="glass-card rounded-2xl p-6 border border-purple-500/20 bg-purple-500/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Ready to Publish?</h3>
                    <p className="text-sm text-zinc-500 mt-1">Select platform and go live in one click</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Instagram Feed", "Instagram Reel", "Facebook Feed"].map(p => (
                        <button key={p} onClick={() => setPublishPlatform(p)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${publishPlatform === p ? "bg-purple-500/30 border-purple-500/50 text-purple-200" : "border-white/8 text-zinc-500 hover:text-zinc-300"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={publish}
                    disabled={publishing}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white relative overflow-hidden shrink-0"
                    style={{ background: publishing ? "rgba(88,28,191,0.5)" : "linear-gradient(135deg, #7c3aed, #db2777)", boxShadow: publishing ? "none" : "0 4px 30px rgba(124,58,237,0.5)" }}
                  >
                    {publishing ? (
                      <><RefreshCw className="w-5 h-5 animate-spin" /><span>Publishing...</span></>
                    ) : (
                      <><Rocket className="w-5 h-5" /><span>Publish to {publishPlatform.split(" ")[0]}</span></>
                    )}
                  </motion.button>
                </div>

                {/* Publishing steps animation */}
                <AnimatePresence>
                  {publishing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-5 space-y-2.5">
                      {PUBLISH_STEPS.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.5 }} className={`flex items-center gap-2.5 text-sm transition-colors duration-500 ${i < deployStep ? "text-emerald-400" : i === deployStep ? "text-white" : "text-zinc-700"}`}>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${i < deployStep ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"}`}>
                            {i < deployStep && <span className="text-[8px] text-black font-bold">✓</span>}
                            {i === deployStep && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                          </div>
                          {s}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 3: Post-publish metrics ── */}
        {step === 3 && published && selectedAd && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <LiveMetrics adName={selectedAd.headline} platform={publishPlatform} />
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="border-zinc-700 text-zinc-400 rounded-xl" onClick={() => { setStep(0); setVariations([]); setPublished(false); setSelectedId(null); }}>
                Create Another Ad
              </Button>
              <Button className="btn-premium text-white rounded-xl px-6" onClick={() => setStep(2)}>
                View Creative
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
