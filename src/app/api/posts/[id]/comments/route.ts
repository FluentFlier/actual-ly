import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  content: z.string().min(1).max(500),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const supabase = getSupabaseAdmin();
  const { data: comments } = await supabase
    .from("comments")
    .select("id, content, created_at, users (username, display_name)")
    .eq("post_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  const normalized = (comments ?? []).map((comment) => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    user: comment.users,
  }));

  return NextResponse.json({ comments: normalized });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
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
    return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
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

  await supabase.from("comments").insert({
    post_id: id,
    user_id: user.id,
    content: parsed.data.content,
  });

  const { data: post } = await supabase
    .from("posts")
    .select("comments_count")
    .eq("id", id)
    .maybeSingle();
  const nextCount = (post?.comments_count ?? 0) + 1;
  await supabase.from("posts").update({ comments_count: nextCount }).eq("id", id);

  return NextResponse.json({ success: true });
}
