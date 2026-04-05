"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Scanning brand identity...",
  "Analyzing market position...",
  "Mapping competitor landscape...",
  "Calibrating brand voice...",
  "Generating growth vectors...",
  "Building AI blueprint...",
];

const BARS_COUNT = 24;

export default function AIThinkingState({ label = "AI is generating..." }: { label?: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(BARS_COUNT).fill(0).map(() => Math.random()));

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1800);

    const barTimer = setInterval(() => {
      setBars(Array(BARS_COUNT).fill(0).map(() => Math.random()));
    }, 400);

    return () => { clearInterval(msgTimer); clearInterval(barTimer); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] gap-8 select-none">
      {/* Animated logo mark */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border border-transparent"
          style={{ borderTopColor: "rgba(168,85,247,0.7)", borderRightColor: "rgba(59,130,246,0.4)" }}
        />
        {/* Inner ring (opposite) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-transparent"
          style={{ borderTopColor: "rgba(236,72,153,0.5)", borderLeftColor: "rgba(168,85,247,0.3)" }}
        />
        {/* Center pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 rounded-full"
            style={{ background: "radial-gradient(circle, #a855f7, #3b82f6)" }}
          />
        </div>
        {/* Glow */}
        <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)", filter: "blur(12px)" }} />
      </div>

      {/* Audio-wave bars */}
      <div className="flex items-center gap-[3px] h-10">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            animate={{ scaleY: height * 0.9 + 0.1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-[3px] rounded-full origin-center"
            style={{
              height: "100%",
              background: `hsl(${270 + i * 3}, 80%, 65%)`,
              opacity: 0.6 + height * 0.4,
            }}
          />
        ))}
      </div>

      {/* Rotating message */}
      <div className="text-center">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-sm font-medium text-zinc-300"
        >
          {MESSAGES[msgIndex]}
        </motion.p>
        <p className="text-xs text-zinc-600 mt-2">{label}</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #a855f7, #3b82f6, #ec4899)" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
