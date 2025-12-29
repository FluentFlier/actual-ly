import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const postId = id;
  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.id) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
    const { data: post } = await supabase
      .from("posts")
      .select("likes_count")
      .eq("id", postId)
      .maybeSingle();
    const nextCount = Math.max(0, (post?.likes_count ?? 0) - 1);
    await supabase.from("posts").update({ likes_count: nextCount }).eq("id", postId);
    return NextResponse.json({ liked: false, likes_count: nextCount });
  }

  await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  const { data: post } = await supabase
    .from("posts")
    .select("likes_count")
    .eq("id", postId)
    .maybeSingle();
  const nextCount = (post?.likes_count ?? 0) + 1;
  await supabase.from("posts").update({ likes_count: nextCount }).eq("id", postId);

  return NextResponse.json({ liked: true, likes_count: nextCount });
}
