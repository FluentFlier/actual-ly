import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ensureDefaultCollections, getDefaultCollectionId } from "@/lib/data/collections";

const schema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  collectionId: z.string().uuid().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get("collectionId");
  let { userId } = await auth();
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

  let query = supabase
    .from("saved_items")
    .select("id, url, title, description, image_url, ai_summary, created_at, collections (name, icon)")
    .eq("user_id", user.id);

  if (collectionId) {
    query = query.eq("collection_id", collectionId);
  }

  const { data } = await query.order("created_at", { ascending: false }).limit(50);

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  let { userId } = await auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = request.headers.get("x-clerk-user-id");
    if (headerId) userId = headerId;
  }
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid saved item" }, { status: 400 });
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

  await ensureDefaultCollections(user.id);
  const fallbackCollection = parsed.data.collectionId
    ? parsed.data.collectionId
    : await getDefaultCollectionId(user.id, "Reading List");

  const { data } = await supabase
    .from("saved_items")
    .insert({
      user_id: user.id,
      url: parsed.data.url,
      title: parsed.data.title ?? parsed.data.url,
      collection_id: fallbackCollection ?? null,
    })
    .select("id, url, title, created_at")
    .single();

  return NextResponse.json({ item: data });
}
