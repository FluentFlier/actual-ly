import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getDashboardStats(clerkId: string) {
  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, trust_score")
    .eq("clerk_id", clerkId)
    .single();

  if (error || !user) {
    return null;
  }

  const [{ count: savedCount }, { count: actionCount }, { count: postCount }] = await Promise.all([
    supabase.from("saved_items").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase
      .from("agent_actions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  return {
    trustScore: user.trust_score,
    savedCount: savedCount ?? 0,
    actionCount: actionCount ?? 0,
    postCount: postCount ?? 0,
  };
}
