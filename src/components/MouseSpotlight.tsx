"use client";

import { useEffect, useRef } from "react";

export default function MouseSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.opacity = "1";
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed z-0 rounded-full opacity-0 transition-opacity duration-300"
      style={{
        width: "600px",
        height: "600px",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(59,130,246,0.03) 40%, transparent 70%)",
        filter: "blur(1px)",
      }}
    />
  );
}
