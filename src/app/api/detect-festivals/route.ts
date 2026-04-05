import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    try {
      reqData = await req.json();
    } catch(e) {}
    
    const { businessType, location, productsServices } = reqData;

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    const prompt = `
      You are an expert marketing strategist focusing on the Indian market.
      Current Month: ${currentMonth}
      Business Type: ${businessType}
      Location: ${location}
      Products/Services: ${productsServices}

      Identify 3 upcoming Indian festivals, occasions, or major cultural trends in the next 30-60 days that this business could leverage for marketing.
      For each event, provide a brief, actionable campaign idea that fits the brand.
      Return the output as a precise JSON array of objects. Do NOT use markdown code blocks outside of the content.
      Schema:
      [
        {
          "name": "string (e.g. Diwali, Monsoon Season)",
          "date": "string (e.g. Late October)",
          "idea": "string (e.g. Launch a limited edition festive box...)"
        }
      ]
    `;

    const result = await generateJSON(prompt);

    if (result && Array.isArray(result) && result.length > 0) {
      return NextResponse.json({ festivals: result });
    } else {
      throw new Error("Invalid array format returned for festivals");
    }
  } catch (error) {
    console.error("Festival detection failed:", error);
    
    const month = new Date().toLocaleString('default', { month: 'long' });
    const bType = reqData.businessType || "business";
    const prod = reqData.productsServices || bType;
    
    const dynamicFestivals = [
      {
        name: "Upcoming Payday / Month-End VIP Sale",
        date: "End of " + month,
        idea: `Target professionals in ${reqData.location || "your city"} with a payday bundle focusing on ${prod}.`
      },
      {
        name: "Local Community Connect Week",
        date: "Next Month",
        idea: `Host an exclusive offline/online event showcasing your ${bType} specifically to the local demographic.`
      },
      {
        name: "Seasonal Wardrobe / Lifestyle Shift",
        date: "Ongoing",
        idea: `Run a high-urgency campaign pushing ${prod} as the essential purchase for the changing weather/season.`
      }
    ];
    
    return NextResponse.json({ festivals: dynamicFestivals, isProgrammatic: true });
  }
}
