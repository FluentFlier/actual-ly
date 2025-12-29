import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  recipientUsername: z.string().min(1),
  content: z.string().min(1).max(500),
});

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

  const { data: messages } = await supabase
    .from("messages")
    .select(
      "id, content, created_at, sender_id, recipient_id, sender:sender_id(username, display_name), recipient:recipient_id(username, display_name)",
    )
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(30);

  return NextResponse.json({ messages: messages ?? [] });
}

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
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: sender } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!sender) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: recipient } = await supabase
    .from("users")
    .select("id")
    .eq("username", parsed.data.recipientUsername.toLowerCase())
    .single();

  if (!recipient) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  const { data } = await supabase
    .from("messages")
    .insert({
      sender_id: sender.id,
      recipient_id: recipient.id,
      content: parsed.data.content,
    })
    .select(
      "id, content, created_at, sender_id, recipient_id, sender:sender_id(username, display_name), recipient:recipient_id(username, display_name)",
    )
    .single();

  return NextResponse.json({ message: data });
}
