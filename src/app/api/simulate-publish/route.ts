import { NextResponse } from "next/server";
import { generateSimulationMetrics, generatePlatformId } from "@/lib/simulation";

export async function POST(req: Request) {
  try {
    const { adId, platform, budget, audience } = await req.json();

    // Generate simulated metrics for this ad
    const metrics = generateSimulationMetrics(budget || 5000, audience || "General", 0.88);
    const platformId = generatePlatformId(platform || "Instagram");

    return NextResponse.json({
      success: true,
      platformId,
      timestamp: new Date().toISOString(),
      platform,
      metrics,
      status: "Live",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
