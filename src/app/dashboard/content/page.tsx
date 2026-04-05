"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Wand2, Copy, CheckCircle2, Sparkles, MessageSquare, PartyPopper, RefreshCw, TrendingUp, Hash } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const TRENDING_TOPICS = [
  { tag: "#AISummer", growth: "+340%", color: "text-pink-400 border-pink-500/30 bg-pink-500/10" },
  { tag: "#StartupIndia", growth: "+180%", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { tag: "#BuildInPublic", growth: "+220%", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { tag: "#SmallBusinessTips", growth: "+95%", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { tag: "#PersonalBrand", growth: "+150%", color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  { tag: "#ContentCreator", growth: "+80%", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
];

export default function ContentPage() {
  const { profile, captions, setCaptions, festivals, setFestivals, onboardingData } = useBusiness();
  const [loadingCaptions, setLoadingCaptions] = useState(false);
  const [loadingFestivals, setLoadingFestivals] = useState(false);
  const [productDesc, setProductDesc] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!festivals && profile && !loadingFestivals) handleGenerateFestivals();
  }, [festivals, profile]);

  const handleGenerateCaptions = async () => {
    if (!productDesc.trim()) { toast.error("Please describe your product first."); return; }
    setLoadingCaptions(true);
    try {
      const res = await fetch("/api/generate-captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productDescription: productDesc, brandTone: profile?.brandTone }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCaptions(data.captions);
      toast.success("3 captions generated!");
    } catch (error) {
      toast.error("Failed to generate captions. Please try again.");
    } finally {
      setLoadingCaptions(false);
    }
  };

  const handleGenerateFestivals = async () => {
    setLoadingFestivals(true);
    try {
      const res = await fetch("/api/detect-festivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: onboardingData?.businessType || profile?.industry,
          location: onboardingData?.location,
          productsServices: onboardingData?.productsServices,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setFestivals(data.festivals);
      if (festivals) toast.success("Upcoming trends detected!");
    } catch {
      if (!festivals) toast.error("Failed to fetch upcoming trends.");
    } finally {
      setLoadingFestivals(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast("Copied to clipboard ✓");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Content Studio</h1>
        <p className="text-zinc-500 text-sm">AI-generated captions, trend radar, and cultural campaign opportunities</p>
      </div>

      <Tabs defaultValue="captions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[480px] mb-8 bg-zinc-900/80 border border-white/5 p-1 rounded-xl">
          <TabsTrigger value="captions" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-sm">
            <MessageSquare className="w-4 h-4 mr-2" />Caption AI
          </TabsTrigger>
          <TabsTrigger value="festivals" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-sm">
            <PartyPopper className="w-4 h-4 mr-2" />Trend Radar
          </TabsTrigger>
          <TabsTrigger value="trending" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />Trending Now
          </TabsTrigger>
        </TabsList>

        {/* Captions Tab */}
        <TabsContent value="captions" className="space-y-6 mt-0">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">What are we posting about today?</h2>
                <p className="text-xs text-zinc-500">Brand tone: <span className="text-purple-400 font-medium">{profile?.brandTone || "Unknown"}</span></p>
              </div>
            </div>
            <Textarea
              placeholder="e.g., We're launching a new summer collection with vibrant colors..."
              className="bg-zinc-900/50 border-white/10 text-white min-h-[120px] resize-none mt-4 mb-4 focus-visible:ring-purple-500 text-sm rounded-xl"
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
            />
            <Button className="btn-premium text-white w-full md:w-auto px-8 rounded-xl" onClick={handleGenerateCaptions} disabled={loadingCaptions || !productDesc.trim()}>
              {loadingCaptions ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Wand2 className="w-4 h-4 mr-2" />Generate 3 Captions</>}
            </Button>
          </div>

          {captions && captions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {captions.map((caption, i) => (
                <div key={i} className="glass-card rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all duration-300 flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 opacity-60" />
                  <div className="p-5 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs">Option {i + 1}</Badge>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors" onClick={() => handleGenerateCaptions()}>
                          <RefreshCw className="w-3 h-3 text-zinc-400" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors" onClick={() => copyToClipboard(caption, i)}>
                          {copiedIndex === i ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-sm">{caption}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* Festivals Tab */}
        <TabsContent value="festivals" className="space-y-6 mt-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white">Upcoming Campaign Opportunities</h2>
              <p className="text-sm text-zinc-500 mt-0.5">AI-detected cultural moments for your marketing</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleGenerateFestivals} disabled={loadingFestivals}
              className="bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-xl">
              {loadingFestivals ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-1.5" />}
              Rescan
            </Button>
          </div>

          {!festivals && loadingFestivals ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-36 rounded-2xl shimmer" />)}
            </div>
          ) : festivals && (
            <div className="grid gap-4 md:grid-cols-3">
              {festivals.map((fest: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="glass-card rounded-2xl p-5 border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/8 rounded-full blur-[50px] group-hover:bg-orange-500/15 transition-all" />
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-orange-400">{fest.name}</h3>
                      <Badge className="bg-zinc-800 text-zinc-300 text-xs border-0">{fest.date}</Badge>
                    </div>
                    <div className="border-t border-white/5 pt-3">
                      <p className="text-xs text-zinc-500 mb-1 font-semibold uppercase tracking-wider">Campaign Idea</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{fest.idea}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-6 mt-0">
          <div className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <Hash className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">Real-Time Trend Radar</h2>
                <p className="text-xs text-zinc-500">Trending hashtags curated for {onboardingData?.businessType || "your industry"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TRENDING_TOPICS.map((topic, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <div className={`rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.02] ${topic.color}`}
                    onClick={() => { navigator.clipboard.writeText(topic.tag); toast(`Copied ${topic.tag} ✓`); }}>
                    <div className="font-bold text-sm mb-1">{topic.tag}</div>
                    <div className="flex items-center gap-1 text-xs opacity-70">
                      <TrendingUp className="w-3 h-3" />
                      {topic.growth} this week
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-4 text-center">Tap any hashtag to copy it instantly</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
