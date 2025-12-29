import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  content: z.string().min(1).max(500),
  type: z.enum(["text", "link", "poll", "job", "collab", "question"]).default("text"),
  linkUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, trust_score")
    .eq("clerk_id", userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.trust_score < 20) {
    return NextResponse.json({ error: "Trust score too low to post." }, { status: 403 });
  }

  const { error: insertError } = await supabase.from("posts").insert({
    user_id: user.id,
    content: parsed.data.content,
    type: parsed.data.type,
    link_url: parsed.data.linkUrl ?? null,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
