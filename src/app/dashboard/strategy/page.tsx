"use client";

import { useEffect, useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Video, Image as ImageIcon, Sparkles, Wand2, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AIThinkingState from "@/components/AIThinkingState";

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { y: 16, opacity: 0 }, visible: { y: 0, opacity: 1 } };

const POST_TYPE_COLORS: Record<string, string> = {
  reel: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  carousel: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  story: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  static: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  video: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const getPostTypeStyle = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("reel") || t.includes("video")) return POST_TYPE_COLORS.reel;
  if (t.includes("carousel") || t.includes("image")) return POST_TYPE_COLORS.carousel;
  if (t.includes("story")) return POST_TYPE_COLORS.story;
  return POST_TYPE_COLORS.static;
};

const getPostTypeIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("reel") || t.includes("video")) return <Video className="w-3.5 h-3.5" />;
  if (t.includes("carousel") || t.includes("image")) return <ImageIcon className="w-3.5 h-3.5" />;
  return <Sparkles className="w-3.5 h-3.5" />;
};

const DAY_COLORS = ["border-t-purple-500", "border-t-blue-500", "border-t-pink-500", "border-t-emerald-500", "border-t-orange-500", "border-t-cyan-500", "border-t-rose-500"];

export default function StrategyPage() {
  const { onboardingData, profile, calendar, setCalendar } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [abDay, setAbDay] = useState<number | null>(null);
  const [abIdeas, setAbIdeas] = useState<Record<number, string[]>>({});

  useEffect(() => {
    if (!calendar && profile && !loading) generateCalendar();
  }, [calendar, profile]);

  const generateCalendar = async () => {
    setLoading(true);
    try {
      const payload = {
        businessType: onboardingData?.businessType || profile?.industry,
        targetAudience: onboardingData?.targetAudience || profile?.targetAudience,
        location: onboardingData?.location,
        productsServices: onboardingData?.productsServices,
        brandTone: profile?.brandTone,
      };
      const res = await fetch("/api/generate-calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to generate calendar");
      const data = await res.json();
      if (data.calendar) { setCalendar(data.calendar); toast.success("7-day strategy generated!"); }
      else throw new Error("Invalid calendar format");
    } catch (error: any) {
      console.warn("Generation failed:", error.message);
      toast.error("Generation failed. Check your Gemini API quota or network.");
    } finally {
      setLoading(false);
    }
  };

  const generateABIdeas = async (dayIndex: number, day: any) => {
    setAbDay(dayIndex);
    // Programmatic A/B ideas
    const base = day.description || "standard content";
    setAbIdeas(prev => ({
      ...prev,
      [dayIndex]: [
        `A: "${base}" — Hook with a bold question, then reveal the answer through visuals. Use trending audio.`,
        `B: "${base}" — Open with shocking statistic, build curiosity, close with strong CTA to DM or click.`
      ]
    }));
  };

  const completedCount = Math.floor((calendar?.length || 0) * 0.4);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Weekly Strategy</h1>
          <p className="text-zinc-500 text-sm">Your 7-day AI-generated content playbook</p>
        </div>
        <Button onClick={generateCalendar} disabled={loading} className="btn-premium text-white rounded-xl px-6">
          <Wand2 className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Generating..." : "Regenerate"}
        </Button>
      </div>

      {/* Progress tracker */}
      {calendar && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-zinc-300">Week Progress</span>
            </div>
            <span className="text-sm text-zinc-500">{completedCount} / {calendar.length} posts done</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / calendar.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
            />
          </div>
          <div className="flex gap-1.5 mt-3">
            {calendar.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i < completedCount ? "bg-emerald-400" : "bg-zinc-700"}`} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && !calendar && (
        <AIThinkingState label="Building your 7-day content strategy..." />
      )}

      {/* Calendar grid */}
      {calendar && (
        <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-5">
          {calendar.map((day: any, i: number) => (
            <motion.div key={i} variants={item}>
              <div className={`glass-card rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all duration-300 h-full overflow-hidden border-t-2 ${DAY_COLORS[i % DAY_COLORS.length]} group`}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{day.day}</span>
                    </div>
                    <Badge className={`text-xs border flex items-center gap-1 ${getPostTypeStyle(day.postType)}`}>
                      {getPostTypeIcon(day.postType)}
                      {day.postType}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-white text-base mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>{day.theme}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3">{day.description}</p>

                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Clock className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{day.timing}</span>
                  </div>

                  {/* A/B button */}
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full text-xs text-zinc-500 hover:text-purple-400 hover:bg-purple-500/5 rounded-xl"
                      onClick={() => generateABIdeas(i, day)}
                    >
                      <Shuffle className="w-3.5 h-3.5 mr-1.5" /> Generate A/B Variations
                    </Button>
                  </div>

                  {/* A/B Ideas */}
                  {abIdeas[i] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-2">
                      {abIdeas[i].map((idea, j) => (
                        <div key={j} className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${j === 0 ? "bg-purple-500/10 text-purple-200 border border-purple-500/20" : "bg-blue-500/10 text-blue-200 border border-blue-500/20"}`}>
                          {idea}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
