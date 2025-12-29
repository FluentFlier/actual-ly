import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  title: z.string().optional(),
  collectionId: z.string().uuid().optional(),
  status: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  let { userId } = auth();
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
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
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

  const update = {
    ...(parsed.data.title ? { title: parsed.data.title } : {}),
    ...(parsed.data.collectionId ? { collection_id: parsed.data.collectionId } : {}),
    ...(parsed.data.status ? { status: parsed.data.status } : {}),
  };

  const { data } = await supabase
    .from("saved_items")
    .update(update)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select("id, title, url")
    .single();

  return NextResponse.json({ item: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  let { userId } = auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = _request.headers.get("x-clerk-user-id");
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

  await supabase.from("saved_items").delete().eq("id", params.id).eq("user_id", user.id);
  return NextResponse.json({ success: true });
}
