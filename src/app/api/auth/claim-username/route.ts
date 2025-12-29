import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ensureDefaultCollections } from "@/lib/data/collections";
import { updateTrustScore } from "@/lib/data/users";

const schema = z.object({
  username: z
    .string()
    .min(10)
    .max(50)
    .regex(/^[a-z0-9_]+$/),
});

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid username format." }, { status: 400 });
  }

  const username = parsed.data.username.toLowerCase();
  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("users")
    .select("id, username, clerk_id")
    .eq("username", username)
    .maybeSingle();

  if (existing && existing.clerk_id !== userId) {
    return NextResponse.json({ error: "Username already taken." }, { status: 409 });
  }

  const { data: currentUser } = await supabase
    .from("users")
    .select("id, username, is_verified")
    .eq("clerk_id", userId)
    .maybeSingle();

  if (currentUser?.is_verified && currentUser.username && currentUser.username !== username) {
    return NextResponse.json(
      { error: "Verified users cannot change username." },
      { status: 403 },
    );
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;
  const phone = clerkUser.primaryPhoneNumber?.phoneNumber ?? null;
  const emailVerified = clerkUser.primaryEmailAddress?.verification?.status === "verified";
  const phoneVerified = clerkUser.primaryPhoneNumber?.verification?.status === "verified";
  const avatarUrl = clerkUser.imageUrl || null;
  const displayName =
    clerkUser.fullName || clerkUser.username || clerkUser.firstName || null;

  const { data: upserted, error } = await supabase
    .from("users")
    .upsert(
      {
        clerk_id: clerkUser.id,
        username,
        email,
        phone,
        display_name: displayName,
        avatar_url: avatarUrl,
        phone_verified: phoneVerified,
        email_verified: emailVerified,
        is_verified: phoneVerified,
        verified_at: phoneVerified ? new Date().toISOString() : null,
      },
      { onConflict: "clerk_id" },
    )
    .select("id")
    .single();

  if (error || !upserted) {
    return NextResponse.json({ error: error?.message ?? "Unable to save user." }, { status: 500 });
  }

  await ensureDefaultCollections(upserted.id);
  await updateTrustScore({ clerkId: clerkUser.id, phoneVerified, emailVerified });

  return NextResponse.json({ success: true, username });
}
