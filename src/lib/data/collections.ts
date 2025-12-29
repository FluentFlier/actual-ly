import { getSupabaseAdmin } from "@/lib/supabase/admin";

const DEFAULT_COLLECTIONS = [
  { name: "Jobs", icon: "💼", position: 0 },
  { name: "Reading List", icon: "📚", position: 1 },
  { name: "Tools", icon: "🧰", position: 2 },
  { name: "People", icon: "🤝", position: 3 },
];

export async function ensureDefaultCollections(userId: string) {
  const supabase = getSupabaseAdmin();
  const { data: existing, error } = await supabase
    .from("collections")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    return;
  }

  if (existing && existing.length > 0) {
    return;
  }

  await supabase.from("collections").insert(
    DEFAULT_COLLECTIONS.map((collection) => ({
      ...collection,
      user_id: userId,
      is_default: true,
    })),
  );
}

export async function getDefaultCollectionId(userId: string, name: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("collections")
    .select("id")
    .eq("user_id", userId)
    .eq("name", name)
    .maybeSingle();

  return data?.id ?? null;
}

export async function getCollections(userId: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("collections")
    .select("id, name, icon, is_default")
    .eq("user_id", userId)
    .order("position", { ascending: true });

  return data ?? [];
}
