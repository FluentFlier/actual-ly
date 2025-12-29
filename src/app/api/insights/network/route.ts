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
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: connections } = await supabase
    .from("connections")
    .select("status")
    .or(`requester_id.eq.${user.id},requestee_id.eq.${user.id}`);

  const accepted = (connections ?? []).filter((item) => item.status === "accepted").length;
  const pending = (connections ?? []).filter((item) => item.status !== "accepted").length;

  return NextResponse.json({ accepted, pending });
}
