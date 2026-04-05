"use client";

import { useState, useRef, useEffect } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Button } from "@/components/ui/button";
import { Bot, Send, User, Sparkles, Zap, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Message = { role: "user" | "assistant"; content: string; timestamp: Date };

const STARTERS = [
  "What's the best content strategy for my brand?",
  "Write 3 Instagram Reels ideas for my business",
  "How should I allocate my ₹10,000 ad budget?",
  "What are the top trends in my industry right now?",
];

export default function ChatPage() {
  const { profile, onboardingData } = useBusiness();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey! I'm your AI Copilot 🚀\n\nI know your business (${onboardingData?.businessName || "your brand"}) inside out — your audience, tone, industry, and goals. Ask me anything about marketing, content, ads, or growth strategy and I'll give you instant personalized advice.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    const userMsg: Message = { role: "user", content: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const systemContext = `
You are an AI marketing copilot for ${onboardingData?.businessName || "the user's business"}.
Business type: ${onboardingData?.businessType || profile?.industry || "Unknown"}
Target Audience: ${onboardingData?.targetAudience || profile?.targetAudience || "Unknown"}
Location: ${onboardingData?.location || "India"}
Brand Tone: ${profile?.brandTone || "Professional"}
USP: ${profile?.usp || "Not defined"}
Products/Services: ${onboardingData?.productsServices || "Unknown"}

You are a world-class marketing strategist. Give concise, actionable, highly personalized advice.
Reply in a friendly but expert tone. Use relevant emojis. Format key points clearly.
      `.trim();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, systemContext }),
      });

      if (!res.ok) throw new Error("Chat failed");
      const data = await res.json();

      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply || "Sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      toast.error("AI response failed. Check your Gemini quota.");
      const fallbackMsg: Message = {
        role: "assistant",
        content: `Great question! For ${onboardingData?.businessName || "your business"}, I'd recommend focusing on authentic storytelling content first — your ${onboardingData?.targetAudience || "target audience"} connects most with genuine brand narratives. Start with 3 Reels per week following the Hook → Value → CTA formula. Let me know if you'd like a specific content calendar! 🎯`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 pulse-glow">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>AI Copilot</h1>
            <p className="text-zinc-500 text-sm">Powered by Gemini — knows your brand DNA</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin" style={{ scrollbarColor: "rgba(168,85,247,0.3) transparent" }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-purple-600 to-blue-600"
                  : "bg-zinc-800 border border-zinc-700"
              }`}>
                {msg.role === "assistant" ? <Sparkles className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-zinc-400" />}
              </div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-sm"
                  : "glass-card text-zinc-200 rounded-tl-sm"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className="text-[10px] mt-1.5 opacity-40">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starter suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 my-4">
          {STARTERS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="px-3 py-2 rounded-xl glass-card border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-purple-500/40 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="mt-4 glass-card rounded-2xl p-3 border border-white/10">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Ask about ${onboardingData?.businessName || "your brand"}...`}
            rows={2}
            className="flex-1 bg-transparent text-white placeholder:text-zinc-600 text-sm resize-none outline-none leading-relaxed"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-premium rounded-xl px-4 py-2 h-auto text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-600">
          <Zap className="w-3 h-3 text-purple-500" />
          <span>Powered by Gemini • Personalized for {onboardingData?.businessName || "your business"} • Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
