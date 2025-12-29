import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  targetUserId: z.string().uuid(),
});

export async function POST(request: Request) {
  let { userId } = await auth();
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
  const { data: current } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!current) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: connections } = await supabase
    .from("connections")
    .select("id, requester_id, requestee_id, status, created_at, accepted_at")
    .or(`requester_id.eq.${current.id},requestee_id.eq.${current.id}`)
    .order("created_at", { ascending: false });

  const otherIds =
    connections
      ?.map((connection) =>
        connection.requester_id === current.id
          ? connection.requestee_id
          : connection.requester_id,
      )
      .filter(Boolean) ?? [];

  const { data: users } = otherIds.length
    ? await supabase
        .from("users")
        .select("id, username, display_name, avatar_url, is_verified")
        .in("id", otherIds)
    : { data: [] };

  const userMap = new Map(users?.map((user) => [user.id, user]));

  const enriched = (connections ?? []).map((connection) => {
    const otherId =
      connection.requester_id === current.id
        ? connection.requestee_id
        : connection.requester_id;
    return {
      ...connection,
      otherUser: userMap.get(otherId) ?? null,
      direction: connection.requester_id === current.id ? "outgoing" : "incoming",
    };
  });

  return NextResponse.json({ connections: enriched });
}
