import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGoogleAccessToken } from "@/lib/integrations/google";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  let { userId } = auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = request.headers.get("x-clerk-user-id");
    if (headerId) userId = headerId;
    if (!userId) {
      const { data: fallback } = await getSupabaseAdmin()
        .from("users")
        .select("clerk_id")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (fallback?.clerk_id) userId = fallback.clerk_id;
    }
  }
  if (!userId) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  const token = await getGoogleAccessToken(userId);
  return NextResponse.json({ connected: Boolean(token) });
}
