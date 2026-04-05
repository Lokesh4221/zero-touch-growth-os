import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    try { reqData = await req.json(); } catch(e) {}

    const { businessName, businessType, targetAudience, location, productsServices } = reqData;

    const prompt = `
You are an expert digital marketing funnel architect.

Business: ${businessName || "N/A"}
Category: ${businessType || "N/A"}
Audience: ${targetAudience || "N/A"}
Location: ${location || "India"}
Products/Services: ${productsServices || "N/A"}

Build a complete 3-stage marketing funnel (TOFU → MOFU → BOFU).
For each stage, provide platform recommendations, content ideas, budget allocation %, and copy hooks.

Return ONLY valid JSON:
{
  "funnel": [
    {
      "stage": "Awareness",
      "emoji": "🌐",
      "goal": "single sentence goal",
      "targetReach": "estimated reach (e.g. 50,000 people)",
      "budgetPercent": 40,
      "platforms": ["Instagram Reels", "YouTube Shorts"],
      "contentIdeas": ["idea 1", "idea 2", "idea 3"],
      "copyHook": "Attention-grabbing opening line for this stage",
      "kpis": ["Impressions", "Video Views", "Reach"]
    },
    {
      "stage": "Consideration",
      "emoji": "🎯",
      "goal": "single sentence goal",
      "targetReach": "estimated reach",
      "budgetPercent": 35,
      "platforms": ["Instagram Stories", "Google Display"],
      "contentIdeas": ["idea 1", "idea 2", "idea 3"],
      "copyHook": "Compelling middle-of-funnel hook",
      "kpis": ["CTR", "Profile Visits", "Link Clicks"]
    },
    {
      "stage": "Conversion",
      "emoji": "💎",
      "goal": "single sentence goal",
      "targetReach": "estimated reach",
      "budgetPercent": 25,
      "platforms": ["Facebook Retargeting", "Google Search"],
      "contentIdeas": ["idea 1", "idea 2", "idea 3"],
      "copyHook": "Urgency-driven closing hook",
      "kpis": ["Conversions", "ROAS", "Revenue"]
    }
  ],
  "totalBudgetSuggestion": "₹X per month",
  "estimatedROAS": "Xx",
  "timeToResults": "X weeks"
}
`;

    const result = await generateJSON(prompt);
    if (result && result.funnel) return NextResponse.json(result);
    throw new Error("Invalid format");
  } catch (error) {
    console.warn("Funnel generation failed:", error);
    const bName = reqData.businessName || "Your Brand";
    const prod = reqData.productsServices || reqData.businessType || "products";
    return NextResponse.json({
      funnel: [
        {
          stage: "Awareness",
          emoji: "🌐",
          goal: `Introduce ${bName} to the maximum number of potential customers`,
          targetReach: "45,000 – 80,000 people",
          budgetPercent: 40,
          platforms: ["Instagram Reels", "YouTube Shorts", "Facebook Video"],
          contentIdeas: [`"Behind the brand" story of ${bName}`, `Trending audio reel showcasing ${prod}`, "User-generated content challenge"],
          copyHook: `You've been looking for this. Meet ${bName}.`,
          kpis: ["Impressions", "Video Views", "Reach"]
        },
        {
          stage: "Consideration",
          emoji: "🎯",
          goal: "Educate and build desire while capturing interest",
          targetReach: "12,000 – 25,000 people",
          budgetPercent: 35,
          platforms: ["Instagram Stories", "Google Display", "Retargeting Ads"],
          contentIdeas: [`Carousel: "Why ${bName} is different"`, "Customer testimonial videos", "Product comparison carousel"],
          copyHook: `Here's what makes ${bName} stand out from everything else.`,
          kpis: ["CTR", "Profile Visits", "Story Replies"]
        },
        {
          stage: "Conversion",
          emoji: "💎",
          goal: "Convert warm audiences into paying customers",
          targetReach: "3,000 – 8,000 people",
          budgetPercent: 25,
          platforms: ["Facebook Retargeting", "Google Search", "WhatsApp Broadcast"],
          contentIdeas: ["Limited-time offer ad with countdown", `"Last chance" ${prod} bundle promotion`, "Direct purchase link with social proof"],
          copyHook: `Don't miss out — this offer from ${bName} ends soon.`,
          kpis: ["Conversions", "ROAS", "Revenue"]
        }
      ],
      totalBudgetSuggestion: "₹15,000 – ₹30,000 per month",
      estimatedROAS: "4.5x",
      timeToResults: "6 – 8 weeks",
      isProgrammatic: true
    });
  }
}
