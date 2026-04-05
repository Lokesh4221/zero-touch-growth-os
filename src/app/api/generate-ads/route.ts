import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import { generateSimulationMetrics } from "@/lib/simulation";


export async function POST(req: Request) {
  let reqData: any = {};
  
  try {
    try {
      reqData = await req.json();
    } catch(e) { /* ignore JSON parse error */ }
    
    const { businessName, businessType, targetAudience, location, productsServices, brandTone } = reqData;

    const prompt = `
You are an expert AI growth marketing strategist for ${businessName || "the provided business"}.

CRITICAL RULES:
- Never use placeholder names like "Zudio" or "Chai by Design".
- Every ad must be intricately customized for ${businessName || "the provided business"}.
- Return ONLY valid JSON matching the exact schema below.

INPUT CONTEXT:
Business Name: ${businessName || "N/A"}
Category: ${businessType || "N/A"}
Location: ${location || "N/A"}
Target Audience: ${targetAudience || "N/A"}
Products/Services: ${productsServices || "N/A"}
Brand Tone: ${brandTone || "N/A"}

OUTPUT JSON FORMAT REQUIRED:
{
  "ads": [
    {
      "platform": "String (e.g., Instagram Reels)",
      "goal": "String (e.g., Conversion)",
      "budget": "String (e.g., $500/week)",
      "audience": "String (specific to target context)",
      "creativeIdea": "String (describe the visual and audio specific to the brand)",
      "primaryText": "String (the ad text)",
      "headline": "String",
      "cta": "String"
    },
    {
      "platform": "String (e.g., Facebook CarouselAds)",
      "goal": "String (e.g., Awareness)",
      "budget": "String (e.g., $250/week)",
      "audience": "String (specific to target context)",
      "creativeIdea": "String (describe the visual and audio specific to the brand)",
      "primaryText": "String (the ad text)",
      "headline": "String",
      "cta": "String"
    }
  ],
  "stats": {
    "ctr": "String (e.g., 4.2%)",
    "cpc": "String (e.g., $1.20)",
    "roas": "String (e.g., 3.5x)",
    "conversionRate": "String (e.g., 2.8%)",
    "impressions": "String",
    "clicks": "String",
    "insights": [
      "String (insight specific to this brand)",
      "String (insight specific to this brand)",
      "String (insight specific to this brand)"
    ]
  }
}
`;

    // Attempt up to 2 times to generate valid JSON if the first fails
    let result = null;
    let attempts = 0;
    while (!result && attempts < 2) {
      attempts++;
      result = await generateJSON(prompt);
      if (result && (!result.ads || !result.stats)) {
        result = null; // invalid structure, retry
      }
    }

    if (result && result.ads && result.stats) {
      return NextResponse.json(result);
    } else {
      throw new Error("Unable to generate valid JSON from Gemini after 2 attempts");
    }
  } catch (error) {
    console.error("Ads generation failed:", error);
    
    const bName = reqData.businessName || "Your Brand";
    const bType = reqData.businessType || "product";
    const prod = reqData.productsServices || bType;

    const dynamicAds = [
      {
        platform: "Instagram Reels",
        goal: "Store Footfall & Conversion",
        budget: "₹5000/week",
        audience: reqData.targetAudience || "18-35 age group locals",
        creativeIdea: `Fast-paced transition video featuring your top-selling ${prod}. Showcasing the amazing value ${bName} provides in ${reqData.location || "your area"}.`,
        primaryText: `Ready to upgrade your style with ${prod}? ✨ Shop the best deals at ${bName} today!`,
        headline: `Exclusive ${bType} at ${bName}`,
        cta: "Shop Now"
      },
      {
        platform: "Facebook Carousel Ads",
        goal: "Brand Awareness",
        budget: "₹2500/week",
        audience: reqData.targetAudience || "Families and professionals",
        creativeIdea: `A vibrant carousel highlighting 4 distinct ${prod} offerings with price tags matching ${bName}'s value proposition.`,
        primaryText: `Discover why everyone loves ${bName}! Swipe to see our customer-favorite ${bType} collections. 👇`,
        headline: `Best ${prod} in Town`,
        cta: "Learn More"
      }
    ];

    const dynamicStats = generateSimulationMetrics(reqData.budget || 5000, reqData.targetAudience || "General", 0.85);

    return NextResponse.json({ ads: dynamicAds, stats: dynamicStats, isProgrammatic: true });

  }
}
