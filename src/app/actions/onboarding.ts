"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function saveOnboardingData(data: {
  businessName: string;
  industry: string;
  targetAudience: string;
  brandTone: string;
  usp: string;
  competitors: string[];
}) {
  // Demo mode - save to context only (no DB)
  console.log('[DEMO] Onboarding data saved:', data);
  revalidatePath("/dashboard");
  return { success: true, workspaceId: "demo-workspace" };
}

export async function getWorkspace() {
  // Demo mode - mock workspace
  return {
    id: "demo-workspace",
    businessName: "Demo Business",
    businessType: "Demo",
    targetAudience: "Demo audience",
    profileData: JSON.stringify({}),
  };
}
