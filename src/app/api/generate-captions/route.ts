import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    try {
      reqData = await req.json();
    } catch(e) {}
    
    const { productDescription, brandTone } = reqData;

    const prompt = `
      You are an expert copywriter.
      Product Description: ${productDescription}
      Brand Tone: ${brandTone || "Professional"}

      Write 3 highly engaging social media captions for this product. 
      Each caption must be in the specified brand tone, include relevant hashtags, and end with a strong Call to Action (CTA).
      Return exactly a JSON array of strings. Do not use markdown blocks around the text.
      Example:
      [
        "caption 1 with emojis and #hashtags \\n\\n CTA",
        "caption 2...",
        "caption 3..."
      ]
    `;

    const result = await generateJSON(prompt);

    if (result && Array.isArray(result) && result.length > 0) {
      return NextResponse.json({ captions: result });
    } else {
      throw new Error("Invalid array format returned for captions");
    }
  } catch (error) {
    console.error("Caption generation failed:", error);
    
    const product = reqData.productDescription || "our latest offering";
    const dynamicCaptions = [
      `Elevate your game with ${product}! ✨ Designed specifically with you in mind. Don't miss out on this. \n\n👉 Click the link in bio to grab yours today! #Trending #MustHave`,
      `Why settle for less when you can have ${product}? 🚀 We put everything into making this perfect for our community. \n\n👇 Drop a ❤️ if you're excited, and shop now! #Innovate #Lifestyle`,
      `The wait is over! 🎉 Meet ${product} - your new favorite obsession. Limited availability, so act fast. \n\n🛍️ Tap to shop and upgrade your routine! #Launch #ShopLocal`
    ];
    
    return NextResponse.json({ captions: dynamicCaptions, isProgrammatic: true });
  }
}
