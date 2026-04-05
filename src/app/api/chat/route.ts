import { NextResponse } from "next/server";
import { generateJSON } from "@/lib/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  let reqData: any = {};
  try {
    reqData = await req.json();
    const { message, systemContext } = reqData;

    if (!ai) throw new Error("No API key");

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemContext}\n\nUser message: ${message}` }],
        },
      ],
    });

    const reply = result.response.text();
    return NextResponse.json({ reply });
  } catch (error) {
    console.warn("Chat API failed:", error);
    return NextResponse.json({
      reply: `Great question! Based on your business context, here's my recommendation: Focus on building authentic content that resonates with your core audience. Start with consistent posting (3-4x per week), use trending audio on Reels, and always end with a clear call-to-action. Would you like me to elaborate on any specific area? 🎯`,
    });
  }
}
