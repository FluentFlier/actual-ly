import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function getSavedItems(clerkId?: string | null) {
  const supabase = getSupabaseAdmin();
  let userId: string | null = null;
  if (clerkId) {
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();
    userId = user?.id ?? null;
  }

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
    return [] as Array<Record<string, unknown>>;
  }

  const { data } = await supabase
    .from("saved_items")
    .select(
      "id, url, title, description, image_url, ai_summary, created_at, collections (name, icon)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}
