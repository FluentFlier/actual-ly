import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { calculateTrustScore } from "@/lib/trust-score";

export async function getInsightsOverview(clerkId: string) {
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id, trust_score")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) return null;

  const [{ count: actionCount }, { count: connectionsCount }, { count: savedCount }] =
    await Promise.all([
      supabase
        .from("agent_actions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("connections")
        .select("id", { count: "exact", head: true })
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},requestee_id.eq.${user.id}`),
      supabase
        .from("saved_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  return {
    trustScore: user.trust_score,
    actionCount: actionCount ?? 0,
    connectionsCount: connectionsCount ?? 0,
    savedCount: savedCount ?? 0,
  };
}

export async function getTrustBreakdown(clerkId: string) {
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id, created_at, phone_verified, email_verified")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) return null;

  const { data: connections } = await supabase
    .from("connections")
    .select("id, requestee_id, requester_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},requestee_id.eq.${user.id}`);

  const otherIds =
    connections
      ?.map((connection) =>
        connection.requester_id === user.id
          ? connection.requestee_id
          : connection.requester_id,
      )
      .filter(Boolean) ?? [];

  const { data: verifiedUsers } = await supabase
    .from("users")
    .select("id")
    .in("id", otherIds)
    .eq("is_verified", true);

  const { data: posts } = await supabase
    .from("posts")
    .select("likes_count, comments_count")
    .eq("user_id", user.id);

  const engagementPoints = Math.min(
    10,
    Math.floor(
      (posts?.reduce((sum, post) => sum + post.likes_count + post.comments_count, 0) || 0) / 100,
    ),
  );

  return calculateTrustScore({
    phoneVerified: user.phone_verified,
    emailVerified: user.email_verified,
    verifiedConnections: verifiedUsers?.length ?? 0,
    createdAt: user.created_at,
    engagementPoints,
  });
}
