import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { calculateTrustScore } from "@/lib/trust-score";
import type { UserProfile } from "@/lib/types";

export async function getUserByUsername(username: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single<UserProfile>();

  if (error) {
    return null;
  }

  return data;
}

export async function getUserByClerkId(clerkId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single<UserProfile>();

  if (error) {
    return null;
  }

  return data;
}

type TrustUpdateInput = {
  clerkId: string;
  phoneVerified: boolean;
  emailVerified: boolean;
};

export async function updateTrustScore({
  clerkId,
  phoneVerified,
  emailVerified,
}: TrustUpdateInput) {
  const supabase = getSupabaseAdmin();

  const { data: user, error } = await supabase
    .from("users")
    .select("id, created_at")
    .eq("clerk_id", clerkId)
    .single();

  if (error || !user) {
    return null;
  }

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

  const verifiedConnections = verifiedUsers?.length ?? 0;

  const { data: engagement } = await supabase
    .from("posts")
    .select("likes_count, comments_count")
    .eq("user_id", user.id);

  const engagementPoints = Math.min(
    10,
    Math.floor(
      (engagement?.reduce((sum, post) => sum + post.likes_count + post.comments_count, 0) || 0) /
        100,
    ),
  );

  const breakdown = calculateTrustScore({
    phoneVerified,
    emailVerified,
    verifiedConnections,
    createdAt: user.created_at,
    engagementPoints,
  });

  const { error: updateError } = await supabase
    .from("users")
    .update({ trust_score: breakdown.total })
    .eq("id", user.id);

  if (updateError) {
    return null;
  }

  return breakdown;
}
