"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);

      dot.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      ringEl.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setIsHidden(false);
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, input, textarea, [data-cursor='pointer'], select, label");
      setIsHovering(!!interactive);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);
    const onLeave = () => setIsHidden(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 768) return null;

  return (
    <>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: isHovering ? "8px" : "8px",
          height: isHovering ? "8px" : "8px",
          background: isHovering ? "#a855f7" : "white",
          opacity: isHidden ? 0 : 1,
          boxShadow: isHovering ? "0 0 12px rgba(168,85,247,0.8)" : "0 0 6px rgba(255,255,255,0.4)",
          transition: "width 0.2s ease, height 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, opacity 0.15s ease",
          willChange: "transform",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full"
        style={{
          width: isHovering ? "48px" : isClicking ? "32px" : "40px",
          height: isHovering ? "48px" : isClicking ? "32px" : "40px",
          border: isHovering
            ? "1.5px solid rgba(168,85,247,0.7)"
            : "1.5px solid rgba(255,255,255,0.25)",
          background: isHovering ? "rgba(168,85,247,0.06)" : "transparent",
          opacity: isHidden ? 0 : 1,
          transform: `scale(${isClicking ? 0.8 : 1})`,
          boxShadow: isHovering ? "0 0 20px rgba(168,85,247,0.2), inset 0 0 10px rgba(168,85,247,0.05)" : "none",
          transition: "width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), border 0.2s ease, background 0.2s ease, box-shadow 0.25s ease, opacity 0.15s ease, transform 0.15s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
