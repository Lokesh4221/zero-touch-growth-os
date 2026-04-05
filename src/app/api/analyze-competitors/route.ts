import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    try { reqData = await req.json(); } catch(e) {}

    const { businessName, businessType, competitors, usp, targetAudience, location } = reqData;

    const prompt = `
You are an elite competitive intelligence analyst.

Business: ${businessName || "N/A"}
Category: ${businessType || "N/A"}
Target Audience: ${targetAudience || "N/A"}
Location: ${location || "India"}
USP: ${usp || "N/A"}
Known Competitors: ${(competitors || []).join(", ") || "None listed"}

Analyze this business against its top 3 competitors. For each competitor, assess their strategy.
Then generate an "opportunity gaps" section showing where this business can outperform them.

Return ONLY valid JSON in this exact schema:
{
  "competitorAnalysis": [
    {
      "name": "Competitor name",
      "strength": "Their strongest point",
      "weakness": "Their biggest gap",
      "platforms": ["Instagram", "Google"],
      "audienceFit": "How well they match the target audience (out of 10)",
      "pricingStrategy": "Premium / Budget / Value",
      "contentTone": "Their brand tone"
    }
  ],
  "opportunityGaps": [
    {
      "title": "Gap title",
      "description": "Actionable way ${businessName} can exploit this gap",
      "impact": "High / Medium / Low"
    }
  ],
  "competitiveScore": {
    "overall": "X/10",
    "brandStrength": "X/10",
    "digitalPresence": "X/10",
    "contentQuality": "X/10"
  }
}
`;

    const result = await generateJSON(prompt);
    if (result && result.competitorAnalysis) return NextResponse.json(result);
    throw new Error("Invalid format");
  } catch (error) {
    console.warn("Competitor analysis failed:", error);
    const bName = reqData.businessName || "Your Brand";
    const comps = reqData.competitors || ["Competitor A", "Competitor B", "Competitor C"];
    return NextResponse.json({
      competitorAnalysis: comps.slice(0, 3).map((c: string, i: number) => ({
        name: c,
        strength: ["Strong digital presence & loyalty programs", "Aggressive pricing strategy", "Wide distribution network"][i] || "Established brand recall",
        weakness: ["Limited personalization & local connect", "Low focus on content marketing", "Poor social media engagement"][i] || "Weak digital engagement",
        platforms: [["Instagram", "YouTube"], ["Facebook", "Google"], ["Instagram", "WhatsApp"]][i] || ["Instagram"],
        audienceFit: ["7/10", "6/10", "5/10"][i] || "6/10",
        pricingStrategy: ["Premium", "Budget", "Value"][i] || "Value",
        contentTone: ["Aspirational", "Promotional", "Informative"][i] || "Professional"
      })),
      opportunityGaps: [
        { title: "Hyper-Local Content Strategy", description: `${bName} can create region-specific content specifically for ${reqData.location || "local"} culture that competitors ignore.`, impact: "High" },
        { title: "Community-Led Growth", description: `Build a micro-community around ${reqData.businessType || "your category"} that competitors haven't tapped into on Instagram.`, impact: "High" },
        { title: "Video-First Brand Story", description: `${bName} can own the short-video narrative with behind-the-scenes and founder story content — a space competitors neglect.`, impact: "Medium" }
      ],
      competitiveScore: { overall: "7/10", brandStrength: "6/10", digitalPresence: "7/10", contentQuality: "8/10" },
      isProgrammatic: true
    });
  }
}
