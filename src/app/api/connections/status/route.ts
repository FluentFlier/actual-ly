import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  let { userId } = await auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = request.headers.get("x-clerk-user-id");
    if (headerId) userId = headerId;
  }
  if (!userId) {
    return NextResponse.json({ status: "none" }, { status: 401 });
  }

  const url = new URL(request.url);
  const targetUserId = url.searchParams.get("targetUserId");
  if (!targetUserId) {
    return NextResponse.json({ status: "none" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: requester } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!requester) {
    return NextResponse.json({ status: "none" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("connections")
    .select("status, requester_id, requestee_id")
    .or(
      `and(requester_id.eq.${requester.id},requestee_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},requestee_id.eq.${requester.id})`,
    )
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ status: "none" });
  }

  if (existing.status === "accepted") {
    return NextResponse.json({ status: "accepted" });
  }

  if (existing.requester_id === requester.id) {
    return NextResponse.json({ status: "pending" });
  }

  return NextResponse.json({ status: "requested" });
}
