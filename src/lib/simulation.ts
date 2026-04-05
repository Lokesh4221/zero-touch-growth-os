/**
 * Simulation logic for metrics, campaigns, and "Smart Publish" flow.
 * No real API dependency.
 */

export interface MetricSet {
  impressions: number;
  clicks: number;
  reach: number;
  ctr: string;
  roas: string;
  conversionRate: string;
  engagement: string;
  cost: number;
  insights?: string[];
}

/**
 * Generate realistic performance metrics based on budget, audience, and creative.
 */
export function generateSimulationMetrics(
  budget: string | number,
  audience: string = "Target Audience",
  creativeQuality: number = 0.85 // 0.0 to 1.0
): MetricSet {
  const budgetNum = typeof budget === "string" ? parseInt(budget.replace(/[^0-9]/g, "")) || 5000 : budget;
  
  // Base CTR: 1.5% - 4.5% based on creative quality
  const ctrBase = 1.5 + creativeQuality * 3.0 + (Math.random() * 0.5);
  // CPC: ₹2.0 - ₹12.0 inversely related to CTR
  const cpc = (15 / ctrBase) + (Math.random() * 1.5);
  
  const clicks = Math.floor(budgetNum / cpc);
  const impressions = Math.floor(clicks / (ctrBase / 100));
  const reach = Math.floor(impressions * (0.7 + Math.random() * 0.2));
  
  // Conversion Rate: 1% - 5%
  const convRate = 1.0 + creativeQuality * 4.0;
  
  // ROAS: 2x - 8x
  const roas = (2.0 + creativeQuality * 6.0 + (Math.random() * 0.5)).toFixed(1);

  // Insights
  const insights = [
    `Reels focusing on ${audience} have a 30% higher engagement rate.`,
    `Your primary demographic is responding well to value-based messaging.`,
    `Consider increasing budget allocation for Facebook Carousels to highlight top offerings.`
  ];
  
  return {
    impressions,
    clicks,
    reach,
    ctr: `${ctrBase.toFixed(1)}%`,
    roas: `${roas}x`,
    conversionRate: `${convRate.toFixed(1)}%`,
    engagement: `${(ctrBase * 1.8).toFixed(1)}%`,
    cost: budgetNum,
    insights,
  };
}


/**
 * Deployment flow steps for "Smart Publish Engine"
 */
export const PUBLISH_STEPS = [
  "🔍 Validating ad creative assets...",
  "📡 Connecting to Smart Publish Proxy...",
  "📤 Uploading assets to edge nodes...",
  "⚙️ Configuring audience targeting matrix...",
  "🎯 Optimizing budget distribution...",
  "✅ Campaign deployed successfully!",
];

/**
 * Generate a realistic platform Post ID
 */
export function generatePlatformId(platform: string): string {
  const prefix = platform.toLowerCase().includes("instagram") ? "ig_" : "fb_";
  const randomStr = Math.random().toString(36).substring(2, 12);
  return `${prefix}${Date.now().toString().slice(-6)}${randomStr}`;
}

/**
 * Simulate live metric increases.
 */
export function getLiveIncrement(currentMetrics: MetricSet) {
  return {
    impressions: Math.floor(Math.random() * 100 + 10),
    clicks: Math.floor(Math.random() * 5 + 1),
    reach: Math.floor(Math.random() * 80 + 5),
  };
}
