import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  action: z.enum(["accept", "decline"]),
});

export async function PATCH(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> },
) {
  const params = await Promise.resolve(context.params as { id: string } | Promise<{ id: string }>);
  const { id } = params;
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
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
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

  const { data: connection } = await supabase
    .from("connections")
    .select("id, requester_id, requestee_id, status")
    .eq("id", id)
    .single();

  if (!connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  if (connection.requestee_id !== current.id && connection.requester_id !== current.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const nextStatus = parsed.data.action === "accept" ? "accepted" : "declined";
  const { data: updated } = await supabase
    .from("connections")
    .update({
      status: nextStatus,
      accepted_at: nextStatus === "accepted" ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("id, status")
    .single();

  return NextResponse.json({ connection: updated });
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> },
) {
  const params = await Promise.resolve(context.params as { id: string } | Promise<{ id: string }>);
  const { id } = params;
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

  const { data: connection } = await supabase
    .from("connections")
    .select("id, requester_id, requestee_id")
    .eq("id", id)
    .single();

  if (!connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }

  if (connection.requestee_id !== current.id && connection.requester_id !== current.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  await supabase.from("connections").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
