import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGoogleAccessToken } from "@/lib/integrations/google";

export async function GET(request: Request) {
  let { userId } = await auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = request.headers.get("x-clerk-user-id");
    if (headerId) userId = headerId;
  }
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const googleToken = await getGoogleAccessToken(userId);

  return NextResponse.json({
    integrations: {
      google_calendar: Boolean(googleToken),
      gmail: Boolean(googleToken),
    },
  });
}
