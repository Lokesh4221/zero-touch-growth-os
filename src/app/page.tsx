"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "@/context/BusinessContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, BarChart3, Brain, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import MouseSpotlight from "@/components/MouseSpotlight";

const FEATURE_PILLS = [
  { icon: Brain, label: "AI Brand Profile" },
  { icon: BarChart3, label: "Growth Strategy" },
  { icon: TrendingUp, label: "Ad Campaigns" },
  { icon: Zap, label: "Content Studio" },
];

const FIELDS = [
  { name: "businessName", label: "Brand / Business Name", placeholder: "e.g. Dominos, Lyka, Nykaa...", type: "input", full: true },
  { name: "businessType", label: "Business Category", placeholder: "e.g. Fashion Retail", type: "input", full: false },
  { name: "location", label: "Location / Focus Market", placeholder: "e.g. Mumbai, India", type: "input", full: false },
  { name: "targetAudience", label: "Target Audience", placeholder: "e.g. Women 18–35 interested in sustainable clothing", type: "input", full: true },
  { name: "productsServices", label: "Key Products or Services", placeholder: "Describe your best-selling items or specific offerings...", type: "textarea", full: true },
];

// 3D tilt card component
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const { setOnboardingData, setProfile, clearData } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: "", businessType: "", targetAudience: "",
    location: "", productsServices: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDemoFill = () =>
    setFormData({
      businessName: "Dominos",
      businessType: "Quick Service Restaurant",
      targetAudience: "Young adults and families who love pizza and fast food in India",
      location: "India",
      productsServices: "Pizza, pasta, garlic bread, beverages, desserts — all made fresh to order.",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      clearData();
      setOnboardingData(formData);

      const res = await fetch("/api/generate-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      if (data.profile) {
        setProfile(data.profile);
        router.push("/dashboard/profile");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.warn("Generation failed:", error.message);
      toast.error("Generation failed. Check your Gemini API quota or network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 xl:p-8 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(88,28,191,0.15) 0%, #030303 60%)" }}>

      {/* Particle background */}
      <ParticleField count={35} />
      <MouseSpotlight />

      {/* Ambient orbs */}
      <div className="fixed top-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(80px)", animation: "float 8s ease-in-out infinite" }} />
      <div className="fixed bottom-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", filter: "blur(80px)", animation: "float 10s ease-in-out infinite reverse" }} />
      <div className="fixed top-[30%] right-[10%] w-[25%] h-[25%] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="w-full max-w-2xl z-10 relative">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl pulse-glow" />
              <div className="relative p-4 rounded-2xl border border-purple-500/30"
                style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.1))", backdropFilter: "blur(12px)" }}>
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-4 leading-[1.05]"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            <span className="gradient-text">Zero-Touch</span>
            <br />
            <span className="text-white">Growth OS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Your AI-powered marketing team in a box.{" "}
            <span className="text-zinc-300 font-medium">One form. Infinite growth.</span>
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-5"
          >
            {FEATURE_PILLS.map((pill, i) => {
              const Icon = pill.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 text-xs text-zinc-400"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}>
                  <Icon className="w-3 h-3 text-purple-400" />
                  {pill.label}
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Form card */}
        <TiltCard>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "rgba(9,9,11,0.85)",
              backdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(168,85,247,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(59,130,246,0.5), transparent)" }} />

            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 w-[300px] h-[150px] -translate-x-1/2 opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium uppercase tracking-wider">AI Ready</span>
                </div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
                  Business Onboarding
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  Tell us about your brand — we'll generate your complete marketing OS in seconds.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {FIELDS.map((field) => (
                  <motion.div
                    key={field.name}
                    className={field.full ? "" : "grid grid-cols-2 gap-4"}
                    layout
                  >
                    {field.full ? (
                      <div className="space-y-2">
                        <Label htmlFor={field.name} className="text-zinc-400 text-sm font-medium">{field.label}</Label>
                        {field.type === "textarea" ? (
                          <div className="relative">
                            <Textarea
                              id={field.name}
                              name={field.name}
                              placeholder={field.placeholder}
                              required
                              value={(formData as any)[field.name]}
                              onChange={handleChange}
                              onFocus={() => setFocused(field.name)}
                              onBlur={() => setFocused(null)}
                              className="min-h-[110px] resize-none text-sm transition-all duration-200 rounded-xl text-white placeholder:text-zinc-600"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: focused === field.name
                                  ? "1px solid rgba(168,85,247,0.5)"
                                  : "1px solid rgba(255,255,255,0.07)",
                                boxShadow: focused === field.name ? "0 0 0 3px rgba(168,85,247,0.1)" : "none",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <Input
                              id={field.name}
                              name={field.name}
                              placeholder={field.placeholder}
                              required
                              value={(formData as any)[field.name]}
                              onChange={handleChange}
                              onFocus={() => setFocused(field.name)}
                              onBlur={() => setFocused(null)}
                              className="h-12 text-sm text-white placeholder:text-zinc-600 rounded-xl transition-all duration-200"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: focused === field.name
                                  ? "1px solid rgba(168,85,247,0.5)"
                                  : "1px solid rgba(255,255,255,0.07)",
                                boxShadow: focused === field.name ? "0 0 0 3px rgba(168,85,247,0.1)" : "none",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ) : null}
                  </motion.div>
                ))}

                {/* 2-col grid fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FIELDS.filter(f => !f.full).map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name} className="text-zinc-400 text-sm font-medium">{field.label}</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        required
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                        onFocus={() => setFocused(field.name)}
                        onBlur={() => setFocused(null)}
                        className="h-12 text-sm text-white placeholder:text-zinc-600 rounded-xl transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: focused === field.name
                            ? "1px solid rgba(168,85,247,0.5)"
                            : "1px solid rgba(255,255,255,0.07)",
                          boxShadow: focused === field.name ? "0 0 0 3px rgba(168,85,247,0.1)" : "none",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5 mt-2">
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors underline underline-offset-4"
                  >
                    Fill with demo data
                  </button>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-sm overflow-hidden w-full md:w-auto justify-center"
                    style={{
                      background: loading
                        ? "rgba(88,28,191,0.5)"
                        : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      boxShadow: loading ? "none" : "0 4px 24px rgba(124,58,237,0.5)",
                    }}
                  >
                    {/* Shimmer sweep */}
                    {!loading && (
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                    )}

                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Analyzing Core Identity...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate AI Blueprint</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </TiltCard>

        {/* Footer trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-zinc-700 mt-6"
        >
          Powered by Gemini AI · No CC required · Setup in under 60 seconds
        </motion.p>
      </div>
    </main>
  );
}
