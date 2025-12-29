import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  targetUserId: z.string().uuid(),
});

export async function POST(request: Request) {
  let { userId } = auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = request.headers.get("x-clerk-user-id");
    if (headerId) userId = headerId;
  }
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: requester } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!requester) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (requester.id === parsed.data.targetUserId) {
    return NextResponse.json({ error: "Cannot connect to yourself" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("connections")
    .select("id, status, requester_id, requestee_id")
    .or(
      `and(requester_id.eq.${requester.id},requestee_id.eq.${parsed.data.targetUserId}),and(requester_id.eq.${parsed.data.targetUserId},requestee_id.eq.${requester.id})`,
    )
    .maybeSingle();

  if (existing?.id) {
    if (existing.status === "accepted") {
      return NextResponse.json({ status: "accepted" });
    }

    if (existing.requester_id === parsed.data.targetUserId) {
      await supabase
        .from("connections")
        .update({ status: "accepted", accepted_at: new Date().toISOString() })
        .eq("id", existing.id);
      return NextResponse.json({ status: "accepted" });
    }

    return NextResponse.json({ status: "pending" });
  }

  await supabase.from("connections").insert({
    requester_id: requester.id,
    requestee_id: parsed.data.targetUserId,
    status: "pending",
  });

  return NextResponse.json({ status: "pending" });
}
