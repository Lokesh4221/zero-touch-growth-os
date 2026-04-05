require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGenerateAds() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return console.log("NO API KEY");
  
  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const businessName = "Lykaa";
  const businessType = "Fashion";
  const targetAudience = "Gen Z";

  const prompt = `
You are an expert AI growth marketing strategist for ${businessName || "the provided business"}.

CRITICAL RULES:
- Never use placeholder names like "Zudio" or "Chai by Design".
- Every ad must be intricately customized for ${businessName || "the provided business"}.
- Return ONLY valid JSON matching the exact schema below.

INPUT CONTEXT:
Business Name: ${businessName || "N/A"}
Category: ${businessType || "N/A"}
Location: N/A
Target Audience: ${targetAudience || "N/A"}
Products/Services: N/A
Brand Tone: N/A

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

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    console.log("Raw Response:");
    console.log(responseText);

    const jsonMatch = responseText.match(/[\s\S]*?({[\s\S]*}|\[[\s\S]*\])/);
    if (jsonMatch && jsonMatch[1]) {
      const parsed = JSON.parse(jsonMatch[1]);
      console.log("Parsed JSON keys:", Object.keys(parsed));
      if (parsed.ads && parsed.stats) {
        console.log("SUCCESS!");
      } else {
        console.log("Missing ads or stats!", parsed);
      }
    } else {
      console.log("Regex match failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testGenerateAds();
