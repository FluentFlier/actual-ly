import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getInsightsOverview } from "@/lib/data/insights";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const overview = await getInsightsOverview(userId);
  return NextResponse.json({ overview });
}
