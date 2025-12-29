import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getFeedPosts(clerkId?: string | null) {
  const supabase = getSupabaseAdmin();
  const { data: posts } = await supabase
    .from("posts")
    .select(
      "id, content, type, link_url, link_preview, ai_summary, poll_options, likes_count, comments_count, created_at, users (id, username, display_name, avatar_url, is_verified)",
    )
    .eq("users.is_verified", true)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!posts || posts.length === 0 || !clerkId) {
    return (posts ?? []).map((post) => ({ ...post, liked: false }));
  }

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) {
    return posts.map((post) => ({ ...post, liked: false }));
  }

  const { data: likes } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("user_id", user.id)
    .in(
      "post_id",
      posts.map((post) => post.id),
    );

  const likedSet = new Set((likes ?? []).map((like) => like.post_id));
  return posts.map((post) => ({ ...post, liked: likedSet.has(post.id) }));
}
