"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string; // e.g. "4.8%", "₹3.20", "82,400"
  duration?: number;
  className?: string;
}

function extractNumber(val: any): { prefix: string; num: number; suffix: string } {
  const str = String(val || "");
  const match = str.match(/([^0-9.]*)([0-9,.]+)(.*)/);
  if (match) {
    return {
      prefix: match[1],
      num: parseFloat(match[2].replace(/,/g, "")),
      suffix: match[3],
    };
  }
  return { prefix: "", num: 0, suffix: str };
}


export default function AnimatedCounter({ value, duration = 1200, className = "" }: AnimatedCounterProps) {
  const [display, setDisplay] = useState("—");
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const { prefix, num, suffix } = extractNumber(value);
    if (isNaN(num)) { setDisplay(value); return; }

    const start = Date.now();
    const isDecimal = String(value || "").includes(".");

    const update = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = num * eased;

      let formatted: string;
      if (isDecimal) {
        formatted = current.toFixed(1);
      } else if (num >= 1000) {
        formatted = Math.floor(current).toLocaleString("en-IN");
      } else {
        formatted = Math.floor(current).toString();
      }

      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(update);
      }
    };

    frameRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}
