import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getAgentActions(clerkId: string) {
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("agent_actions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return data ?? [];
}
