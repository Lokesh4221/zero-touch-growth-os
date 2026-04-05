import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const MODEL_NAME = "gemini-2.5-flash";

/**
 * Helper function to safely call Gemini and parse JSON.
 * Returns null if the API key is missing or if the call fails,
 * which signals the caller to use fallback data.
 */
export async function generateJSON(prompt: string): Promise<any | null> {
  if (!ai) {
    console.warn("GEMINI_API_KEY is missing. Falling back to mock data.");
    return null;
  }

  try {
    const model = ai.getGenerativeModel({ model: MODEL_NAME });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();

    if (responseText && responseText.trim() !== "") {
      // Use regex to extract everything between the first { or [ and the last } or ]
      const jsonMatch = responseText.match(/[\s\S]*?({[\s\S]*}|\[[\s\S]*\])/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          return null;
        }
      }
      return null;
    }
    return null;
  } catch (error: any) {
    console.error("Gemini API Error:", error?.message || error);
    return null;
  }
}
