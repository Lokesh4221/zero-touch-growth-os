import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    try { reqData = await req.json(); } catch(e) {}
    const { businessName, businessType, targetAudience, location, productsServices, brandTone, totalBudget } = reqData;

    const prompt = `
You are a complete AI marketing strategy engine. Generate a full integrated marketing campaign plan for:

Business: ${businessName}
Type: ${businessType}
Audience: ${targetAudience}
Location: ${location || "India"}
Products: ${productsServices}
Tone: ${brandTone || "Professional"}
Total Monthly Budget: ${totalBudget || "₹25,000"}

Generate a COMPLETE, INTERCONNECTED campaign plan. Every section must reference ${businessName} specifically.

Return ONLY valid JSON:
{
  "campaignName": "Unique campaign name for ${businessName}",
  "strategy": {
    "theme": "Core campaign theme",
    "duration": "4 weeks",
    "primaryGoal": "Primary business goal",
    "keyMessage": "Core message to audience"
  },
  "contentPlan": [
    { "week": 1, "focus": "Awareness", "posts": 5, "formats": ["Reel", "Story"], "theme": "Week theme" },
    { "week": 2, "focus": "Engagement", "posts": 6, "formats": ["Carousel", "Reel"], "theme": "Week theme" },
    { "week": 3, "focus": "Consideration", "posts": 5, "formats": ["Story", "Static"], "theme": "Week theme" },
    { "week": 4, "focus": "Conversion", "posts": 7, "formats": ["Reel", "Story", "Ad"], "theme": "Week theme" }
  ],
  "adCampaign": {
    "headline": "Primary ad headline",
    "primaryText": "Ad copy (2-3 sentences)",
    "cta": "CTA text",
    "platforms": ["Instagram", "Facebook"],
    "budget": "Weekly budget"
  },
  "funnel": {
    "awareness": { "budget": "40%", "channels": ["Reels", "YouTube Shorts"], "kpi": "50K reach" },
    "consideration": { "budget": "35%", "channels": ["Stories", "Google"], "kpi": "8K clicks" },
    "conversion": { "budget": "25%", "channels": ["Retargeting", "WhatsApp"], "kpi": "400 sales" }
  },
  "budgetAllocation": [
    { "channel": "Instagram", "amount": "₹X,XXX", "percent": 40 },
    { "channel": "Facebook", "amount": "₹X,XXX", "percent": 25 },
    { "channel": "Google", "amount": "₹X,XXX", "percent": 20 },
    { "channel": "Content Creation", "amount": "₹X,XXX", "percent": 15 }
  ],
  "kpis": {
    "expectedReach": "X,XXX",
    "expectedClicks": "X,XXX",
    "expectedROAS": "X.Xx",
    "expectedConversions": "XXX"
  }
}
`;
    const result = await generateJSON(prompt);
    if (result && result.campaignName) return NextResponse.json(result);
    throw new Error("Invalid format");
  } catch (error) {
    console.warn("Campaign gen failed:", error);
    const bName = reqData.businessName || "Your Brand";
    const budget = reqData.totalBudget || "₹25,000";
    return NextResponse.json({
      campaignName: `${bName} Growth Sprint — Q2 2026`,
      strategy: {
        theme: `The ${bName} Experience — Where Quality Meets Value`,
        duration: "4 weeks",
        primaryGoal: "Drive brand awareness and convert new customers",
        keyMessage: `Discover why ${bName} is the top choice for ${reqData.targetAudience || "your audience"}`
      },
      contentPlan: [
        { week: 1, focus: "Awareness", posts: 5, formats: ["Reel", "Story"], theme: `Introduce ${bName} to new audiences` },
        { week: 2, focus: "Engagement", posts: 6, formats: ["Carousel", "Reel"], theme: `Showcase ${reqData.productsServices || "offerings"} in detail` },
        { week: 3, focus: "Consideration", posts: 5, formats: ["Story Poll", "Static"], theme: "Customer testimonials & social proof" },
        { week: 4, focus: "Conversion", posts: 7, formats: ["Reel", "Story Ad", "DM"], theme: "Limited-time offer + urgency close" }
      ],
      adCampaign: {
        headline: `The Best of ${reqData.businessType || "Your Category"} — Only at ${bName}`,
        primaryText: `Tired of settling for less? ${bName} brings you premium quality at unbeatable value. Join thousands of happy customers in ${reqData.location || "India"} today.`,
        cta: "Shop Now",
        platforms: ["Instagram Reels", "Facebook Carousel"],
        budget: "₹6,250/week"
      },
      funnel: {
        awareness: { budget: "40%", channels: ["Instagram Reels", "YouTube Shorts"], kpi: "55K reach" },
        consideration: { budget: "35%", channels: ["Instagram Stories", "Google Display"], kpi: "9K clicks" },
        conversion: { budget: "25%", channels: ["Facebook Retargeting", "WhatsApp"], kpi: "450 conversions" }
      },
      budgetAllocation: [
        { channel: "Instagram", amount: "₹10,000", percent: 40 },
        { channel: "Facebook", amount: "₹6,250", percent: 25 },
        { channel: "Google", amount: "₹5,000", percent: 20 },
        { channel: "Content Creation", amount: "₹3,750", percent: 15 }
      ],
      kpis: {
        expectedReach: "55,000",
        expectedClicks: "9,200",
        expectedROAS: "4.8x",
        expectedConversions: "450"
      },
      isProgrammatic: true
    });
  }
}
