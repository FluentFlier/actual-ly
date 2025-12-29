import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getFeedPosts() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("posts")
    .select("id, content, created_at, users (username, display_name, avatar_url, is_verified)")
    .eq("users.is_verified", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}
