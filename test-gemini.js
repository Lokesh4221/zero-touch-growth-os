// test-gemini.js
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("NO API KEY");
    return;
  }
  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

  console.log("Sending prompt...");
  try {
    const prompt = `
    You are an AI growth marketing strategist for Dominos.
        
    OUTPUT (JSON ONLY MUST MATCH THIS EXACT STRUCTURE):
    {
      "ads": [{"platform": "Instagram Reels", "goal": "Store Footfall", "budget": "₹5000/week", "audience": "Brief audience description", "creativeIdea": "Visual concept of the ad", "primaryText": "Caption", "headline": "Headline", "cta": "Find A Store"}]
    }`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
