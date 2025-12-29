import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getTrustBreakdown } from "@/lib/data/insights";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const breakdown = await getTrustBreakdown(userId);
  return NextResponse.json({ breakdown });
}
