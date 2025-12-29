import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  let userIdInternal = user?.id ?? null;
  if (!userIdInternal && process.env.DEV_BYPASS_AUTH === "true") {
    const { data: fallback } = await supabase
      .from("users")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    userIdInternal = fallback?.id ?? null;
  }

  if (!userIdInternal) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data } = await supabase
    .from("agent_conversations")
    .select("messages")
    .eq("user_id", userIdInternal)
    .eq("channel", "web")
    .maybeSingle();

  return NextResponse.json({ messages: data?.messages ?? [] });
}

export async function DELETE(request: Request) {
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

  await supabase.from("agent_conversations").delete().eq("user_id", user.id);
  return NextResponse.json({ success: true });
}
