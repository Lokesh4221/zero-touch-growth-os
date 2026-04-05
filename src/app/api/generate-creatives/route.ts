import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

// Budget tier logic for programmatic fallback
function getBudgetTier(budget: string): "micro" | "mid" | "premium" {
  const num = parseInt(budget.replace(/[^0-9]/g, "")) || 5000;
  if (num <= 3000) return "micro";
  if (num <= 15000) return "mid";
  return "premium";
}

// Platform-specific hook strategy
function getPlatformStyle(platform: string): string {
  const p = (platform || "").toLowerCase();
  if (p.includes("reel") || p.includes("story")) return "fast-cut, trending audio, Gen-Z hook, visual-first, text overlays";
  if (p.includes("facebook")) return "informative, detailed headline, social proof heavy, older demo focused";
  if (p.includes("youtube")) return "longer hook, educational tone, trust-building narrative";
  if (p.includes("linkedin")) return "professional tone, ROI-focused, B2B language, authority-driven";
  return "visual, trendy, benefit-driven, mobile-first";
}

// Audience-specific tone
function getAudienceTone(audience: string, goal: string): string {
  const a = (audience || "").toLowerCase();
  const g = (goal || "").toLowerCase();
  let tone = "";
  if (a.includes("youth") || a.includes("gen z") || a.includes("18")) tone += "playful, slang-aware, meme-friendly ";
  if (a.includes("professional") || a.includes("business")) tone += "authoritative, ROI-focused, professional ";
  if (a.includes("women") || a.includes("female")) tone += "aspirational, lifestyle-driven, empowering ";
  if (a.includes("men") || a.includes("male")) tone += "direct, performance-oriented, achievement-focused ";
  if (g.includes("awareness")) tone += "story-driven, brand-building, memorable ";
  if (g.includes("sales") || g.includes("conversion")) tone += "urgency-driven, benefit-heavy, CTA-focused ";
  if (g.includes("lead")) tone += "value-first, trust-building, problem-solution ";
  return tone.trim() || "engaging, benefit-driven, action-oriented";
}

// Budget-adaptive variation config
function getBudgetVariations(tier: "micro" | "mid" | "premium", bName: string, audience: string, business: string, location: string, goal: string, platform: string) {
  const audienceTone = getAudienceTone(audience, goal);
  const platformStyle = getPlatformStyle(platform);
  const now = new Date();
  const seed = now.getMinutes() + now.getSeconds(); // ensure variation across calls

  const hooks = {
    micro: [
      { hook: "Problem-Solution Hook", cta: "Try Free", emoji: "💡", gradient: "from-violet-600 via-purple-700 to-indigo-900", accent: "#8B5CF6" },
      { hook: "Curiosity Hook", cta: "See Why", emoji: "👀", gradient: "from-blue-600 via-cyan-700 to-teal-900", accent: "#06B6D4" },
      { hook: "Relatability Hook", cta: "Learn More", emoji: "🎯", gradient: "from-emerald-600 via-green-700 to-teal-900", accent: "#10B981" },
    ],
    mid: [
      { hook: "Social Proof Hook", cta: "Join Them", emoji: "✨", gradient: "from-pink-600 via-rose-700 to-purple-900", accent: "#EC4899" },
      { hook: "Curiosity Hook", cta: "Discover Now", emoji: "🚀", gradient: "from-violet-700 via-purple-800 to-indigo-900", accent: "#8B5CF6" },
      { hook: "Urgency Hook", cta: "Grab Offer", emoji: "⚡", gradient: "from-amber-500 via-orange-600 to-red-700", accent: "#F59E0B" },
    ],
    premium: [
      { hook: "Luxury Authority Hook", cta: "Experience It", emoji: "💎", gradient: "from-slate-700 via-zinc-800 to-neutral-900", accent: "#94A3B8" },
      { hook: "Exclusivity Hook", cta: "Get Early Access", emoji: "🏆", gradient: "from-yellow-600 via-amber-700 to-orange-900", accent: "#EAB308" },
      { hook: "Transformation Hook", cta: "Start Today", emoji: "🌟", gradient: "from-violet-600 via-fuchsia-700 to-purple-900", accent: "#A855F7" },
    ],
  }[tier];

  const formats = platform.toLowerCase().includes("reel") ? ["Reel", "Reel", "Reel"]
    : platform.toLowerCase().includes("story") ? ["Story", "Story", "Story"]
    : platform.toLowerCase().includes("facebook") ? ["Facebook Ad", "Facebook Ad", "Carousel"]
    : ["Feed Post", "Reel", "Story"];

  const budgetNum = { micro: 2000, mid: 8000, premium: 35000 }[tier];
  const ctrBase = { micro: [2.1, 3.4, 2.8], mid: [4.2, 5.8, 3.9], premium: [6.1, 7.3, 5.6] }[tier];
  const roasBase = { micro: [2.8, 2.3, 3.1], mid: [5.1, 4.3, 6.2], premium: [8.4, 7.1, 9.2] }[tier];
  const confBase = { micro: [74, 81, 69], mid: [87, 92, 81], premium: [91, 88, 94] }[tier];
  const matchBase = { micro: ["High", "Medium", "High"], mid: ["High", "Very High", "High"], premium: ["Very High", "Very High", "High"] }[tier];

  const headlineTemplates = {
    micro: [
      `Fix ${audience.split(" ")[0] || "Your"}'s Biggest Problem`,
      `Why Everyone's Switching to ${bName}`,
      `You're Not Alone — ${bName} Gets It`,
    ],
    mid: [
      `${seed % 2 === 0 ? "10,000+" : "5,000+"} Love ${bName}`,
      `The Secret to ${goal.split(" ")[0]} With ${bName}`,
      `Last ${seed % 3 === 0 ? "48" : "24"} Hours — Don't Miss Out`,
    ],
    premium: [
      `${bName} — The Premium Choice`,
      `Only ${seed % 2 === 0 ? "500" : "250"} Spots Left`,
      `Trusted by ${location}'s Elite`,
    ],
  }[tier];

  return hooks.map((h, i) => ({
    id: `v${i + 1}`,
    hook: h.hook,
    headline: headlineTemplates[i],
    subheadline: `${audienceTone.split(",")[0].trim()} messaging for ${audience.split(" ").slice(0, 3).join(" ") || "your audience"}`,
    primaryText: `${bName} is built for ${audience || "people like you"} in ${location || "India"}. ${
      tier === "micro" ? `Even with a small budget, ${bName} delivers results that matter.` :
      tier === "mid" ? `Join thousands who trust ${bName} for ${goal.toLowerCase()}.` :
      `Experience the premium ${bName} difference — because you deserve the best.`
    } ${h.cta} now.`,
    cta: h.cta,
    caption: `${h.emoji} ${headlineTemplates[i]}!\n\n${bName} understands ${audience || "you"}. Built for ${goal.toLowerCase()} on ${platform}. ${platformStyle.split(",")[0]}.\n\n#${bName.replace(/\s/g, "")} #${(business || "brand").replace(/\s/g, "")} #${location?.replace(/\s/g, "") || "India"} #${goal.replace(/\s/g, "")} #${platform.replace(/\s/g, "")}`,
    visualStyle: `${tier === "premium" ? "High-production" : tier === "mid" ? "Professional" : "Clean minimal"} style — ${platformStyle}`,
    colorPalette: [h.accent, "#1E1E2E", "#FFFFFF"],
    accentColor: h.accent,
    bgGradient: h.gradient,
    emoji: h.emoji,
    format: formats[i],
    estimatedCTR: `${(ctrBase[i] + (seed % 3) * 0.1).toFixed(1)}%`,
    estimatedROAS: `${(roasBase[i] + (seed % 2) * 0.2).toFixed(1)}x`,
    confidence: confBase[i] + (seed % 5),
    audienceMatch: matchBase[i],
    budgetTier: tier,
    platformOptimized: platform,
  }));
}

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    try { reqData = await req.json(); } catch(e) {}
    const {
      businessName, businessType, targetAudience, location,
      productsServices, brandTone, adGoal, budget, style, platform, sessionSeed
    } = reqData;

    const tier = getBudgetTier(budget || "₹5,000");
    const platformStyle = getPlatformStyle(platform || "Instagram Feed");
    const audienceTone = getAudienceTone(targetAudience || "", adGoal || "Sales");
    const budgetNum = parseInt((budget || "5000").replace(/[^0-9]/g, ""));

    const prompt = `
You are an elite AI ad creative director. Generate fresh, UNIQUE ad creatives every single time.

IMPORTANT: Generate completely NEW content — do NOT repeat previous outputs.
Seed for uniqueness: ${sessionSeed || Date.now()}

Business: ${businessName}
Type: ${businessType}
Audience: ${targetAudience}
Location: ${location || "India"}
Products: ${productsServices}
Brand Tone: ${brandTone || style || "Bold & Modern"}
Ad Goal: ${adGoal || "Sales"}
Budget: ${budget || "₹5,000"} (Tier: ${tier} — ${tier === "micro" ? "simple/minimal ads" : tier === "mid" ? "professional ads" : "high-production premium ads"})
Platform: ${platform || "Instagram Feed"} (Style: ${platformStyle})
Audience Tone: ${audienceTone}

BUDGET ADAPTATION RULES:
${tier === "micro" ? "- Low budget: Use simple, relatable messaging. No celebrity/luxury feel. Problem-solution hooks. Minimal production." : ""}
${tier === "mid" ? "- Mid budget: Professional polish. Social proof. Mix of hooks. Platform-native formats." : ""}
${tier === "premium" ? "- High budget: Premium language. Exclusivity and authority. High-production visual descriptions. Luxury hooks." : ""}

PLATFORM ADAPTATION: ${platform} ads need: ${platformStyle}

Generate exactly 3 high-converting ad creative variations differing in hook, style and CTA.
Return ONLY valid JSON (no extra text):
{
  "variations": [
    {
      "id": "v1",
      "hook": "Hook strategy name",
      "headline": "Unique ${businessName}-specific headline max 8 words",
      "subheadline": "Unique supporting line max 12 words",
      "primaryText": "Unique ${businessName}-specific ad copy. 2-3 sentences. ${adGoal} focused.",
      "cta": "Action-specific CTA",
      "caption": "${platform} caption with emojis and 5 relevant hashtags",
      "visualStyle": "${tier} production visual description for ${platform}",
      "colorPalette": ["#hex1", "#hex2", "#hex3"],
      "accentColor": "#hex",
      "bgGradient": "from-[color] via-[color] to-[color]",
      "emoji": "single relevant emoji",
      "format": "${platform.includes("Reel") ? "Reel" : platform.includes("Story") ? "Story" : "Feed Post"}",
      "estimatedCTR": "X.X%",
      "estimatedROAS": "X.Xx",
      "confidence": number 70-98,
      "audienceMatch": "High or Very High"
    },
    { "id": "v2", ... },
    { "id": "v3", ... }
  ],
  "videoScript": {
    "title": "30-second Reel script for ${businessName}",
    "hook": "Unique opening hook for ${adGoal}",
    "scenes": [
      { "time": "0-3s", "visual": "${platform}-optimized visual", "audio": "Hook line" },
      { "time": "3-10s", "visual": "Product/service showcase", "audio": "${adGoal} pitch" },
      { "time": "10-25s", "visual": "Social proof or demo", "audio": "Benefit story" },
      { "time": "25-30s", "visual": "${businessName} logo + CTA", "audio": "Strong close" }
    ],
    "music": "Trending genre/song suggestion for ${platform}",
    "style": "${platformStyle}"
  }
}
`;
    const result = await generateJSON(prompt);
    if (result?.variations?.length > 0) {
      // Tag each variation with inputs for client-side staleness detection
      result.variations = result.variations.map((v: any) => ({
        ...v, platformOptimized: platform, budgetTier: tier,
      }));
      return NextResponse.json({ ...result, inputHash: `${budget}-${adGoal}-${style}-${platform}` });
    }
    throw new Error("Invalid or empty response from AI");
  } catch (error) {
    console.warn("Creative gen: AI failed, using smart adaptive fallback:", error);
    const bName = reqData.businessName || "Your Brand";
    const tier = getBudgetTier(reqData.budget || "₹5,000");
    const variations = getBudgetVariations(
      tier, bName,
      reqData.targetAudience || "your audience",
      reqData.businessType || "brand",
      reqData.location || "India",
      reqData.adGoal || "Sales",
      reqData.platform || "Instagram Feed"
    );
    return NextResponse.json({
      variations,
      videoScript: {
        title: `30-Second ${reqData.platform || "Reel"} Script for ${bName}`,
        hook: tier === "premium" ? `"The ${bName} difference speaks for itself."` : tier === "mid" ? `"Stop scrolling — this changes everything."` : `"Struggling with this? ${bName} has you covered."`,
        scenes: [
          { time: "0–3s", visual: `${tier === "premium" ? "Cinematic slow-motion" : "Fast zoom"} into ${bName} logo`, audio: tier === "premium" ? `"The standard has changed."` : `"Wait — is this real?"` },
          { time: "3–10s", visual: `${reqData.productsServices ? "Showcase of " + reqData.productsServices.split(" ").slice(0, 4).join(" ") : "Product hero shot"}`, audio: `"${bName} — built for ${reqData.targetAudience?.split(" ").slice(0, 3).join(" ") || "you"}"` },
          { time: "10–25s", visual: tier === "micro" ? "Customer testimonial B-roll" : "Lifestyle montage with text overlays", audio: `"${reqData.adGoal === "Sales" ? "Shop now and save" : reqData.adGoal === "Lead Generation" ? "Get yours free today" : "Try it risk-free"}"` },
          { time: "25–30s", visual: `${bName} logo + CTA screen`, audio: `"Link in bio — don't wait!"` },
        ],
        music: tier === "premium" ? "Cinematic orchestral or lo-fi luxury" : tier === "mid" ? "Trending trap beat or upbeat pop" : "Uplifting acoustic or viral audio",
        style: getPlatformStyle(reqData.platform || "Instagram Feed"),
      },
      inputHash: `${reqData.budget}-${reqData.adGoal}-${reqData.style}-${reqData.platform}`,
      isProgrammatic: true,
    });
  }
}
