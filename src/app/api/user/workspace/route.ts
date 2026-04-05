import { NextResponse } from "next/server";
import { getWorkspace } from "@/app/actions/onboarding";

export async function GET() {
  try {
    const workspace = await getWorkspace();
    if (!workspace) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }
    return NextResponse.json(workspace);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
