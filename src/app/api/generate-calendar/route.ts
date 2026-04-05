import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    try {
      reqData = await req.json();
    } catch(e) {}

    const { businessType, targetAudience, location, productsServices, brandTone } = reqData;

    const prompt = `
      You are an expert social media manager.
      Business details:
      Type: ${businessType}
      Audience: ${targetAudience}
      Location: ${location}
      Products/Services: ${productsServices}
      Brand Tone: ${brandTone}

      Generate a 7-day social media content calendar specifically adapted to the Indian market and audience.
      Return the output as a precise JSON array of objects. Do NOT use markdown code blocks outside of the content.
      Schema:
      [
        {
          "day": "Day 1",
          "theme": "string, e.g. Behind the Scenes",
          "postType": "string, e.g. Reel, Carousel, Story",
          "timing": "string, e.g. 10:00 AM",
          "description": "string, brief details on what to show"
        }
      ]
      Exactly 7 items.
    `;

    const result = await generateJSON(prompt);

    if (result && Array.isArray(result)) {
      return NextResponse.json({ calendar: result });
    } else {
      throw new Error("Invalid format returned by Gemini");
    }
  } catch (error) {
    console.error("Calendar generation failed:", error);
    
    const bType = reqData.businessType || "business";
    const dynamicCalendar = [
      { day: "Day 1", theme: "Brand Story & Intro", postType: "Reel", timing: "10:00 AM", description: `Introduce the core value of your ${bType} and why you started.` },
      { day: "Day 2", theme: "Product Showcase", postType: "Carousel", timing: "2:00 PM", description: `Highlight top features of ${reqData.productsServices || "your products"} with close-up shots.` },
      { day: "Day 3", theme: "Customer Testimonial", postType: "Static Post", timing: "5:00 PM", description: `Share a powerful review from a customer in ${reqData.location || "your area"}.` },
      { day: "Day 4", theme: "Behind the Scenes", postType: "Story (Interactive)", timing: "11:00 AM", description: `Show a day in the life of running your ${bType}. Use a poll sticker.` },
      { day: "Day 5", theme: "Educational Tip", postType: "Reel", timing: "4:00 PM", description: `Teach your audience something valuable related to ${reqData.productsServices || "your service"}.` },
      { day: "Day 6", theme: "Weekend Offer", postType: "Carousel", timing: "6:00 PM", description: `Announce a special offer specifically for ${reqData.targetAudience || "your followers"}.` },
      { day: "Day 7", theme: "Community Spotlight", postType: "Reel", timing: "12:00 PM", description: `Highlight how your ${bType} is engaging with the local community.` }
    ];
    
    return NextResponse.json({ calendar: dynamicCalendar, isProgrammatic: true });
  }
}
