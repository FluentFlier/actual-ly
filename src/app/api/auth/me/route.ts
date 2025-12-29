import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/data/users";
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
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  return NextResponse.json({ user });
}
