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

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const query = searchParams.get("q");

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let requestBuilder = supabase
    .from("agent_actions")
    .select("id, action_type, input_text, output_text, status, created_at, time_saved_seconds")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (type && type !== "all") {
    requestBuilder = requestBuilder.eq("action_type", type);
  }

  if (query) {
    requestBuilder = requestBuilder.or(
      `input_text.ilike.%${query}%,output_text.ilike.%${query}%`,
    );
  }

  const { data } = await requestBuilder;
  return NextResponse.json({ actions: data ?? [] });
}
