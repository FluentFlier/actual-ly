import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleAgentMessage } from "@/lib/agent/handle-message";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let { userId } = await auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = request.headers.get("x-clerk-user-id");
    if (headerId) userId = headerId;
    if (!userId) {
      const supabase = getSupabaseAdmin();
      const { data: fallback } = await supabase
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

  const { message } = (await request.json()) as { message?: string };
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  try {
    const responseText = await handleAgentMessage({
      clerkId: userId,
      message,
      channel: "web",
    });

    return NextResponse.json({ response: responseText });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Agent unavailable" },
      { status: 502 },
    );
  }
}
