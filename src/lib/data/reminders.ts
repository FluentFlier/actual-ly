import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getUpcomingReminders(clerkId: string) {
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  let userId = user?.id;
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const { data: fallback } = await supabase
      .from("users")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    userId = fallback?.id ?? null;
  }

  if (!userId) {
    return [] as Array<{ id: string; content: string; remind_at: string }>;
  }

  const { data } = await supabase
    .from("reminders")
    .select("id, content, remind_at")
    .eq("user_id", userId)
    .order("remind_at", { ascending: true })
    .limit(3);

  return data ?? [];
}
