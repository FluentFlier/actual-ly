import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { updateTrustScore } from "@/lib/data/users";
import { ensureDefaultCollections } from "@/lib/data/collections";

export async function POST(request: Request) {
  try {
    let { userId } = auth();
    if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
      const headerId = request.headers.get("x-clerk-user-id");
      if (headerId) userId = headerId;
      if (!userId) {
        const supabase = getSupabaseAdmin();
        const { data: fallback } = await supabase
          .from("users")
          .select("clerk_id")
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();
        if (fallback?.clerk_id) userId = fallback.clerk_id;
      }
    }
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const client = await clerkClient();
    let clerkUser;
    try {
      clerkUser = await client.users.getUser(userId);
    } catch (err) {
      if (process.env.DEV_BYPASS_AUTH === "true") {
        const supabase = getSupabaseAdmin();
        const { data: fallback } = await supabase
          .from("users")
          .select("id, clerk_id, username")
          .eq("clerk_id", userId)
          .maybeSingle();
        if (fallback) {
          return NextResponse.json({ success: true });
        }
      }
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Clerk user lookup failed" },
        { status: 500 },
      );
    }
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  const email = clerkUser.primaryEmailAddress?.emailAddress ?? null;
  const phone = clerkUser.primaryPhoneNumber?.phoneNumber ?? null;
  const emailVerified = clerkUser.primaryEmailAddress?.verification?.status === "verified";
  const phoneVerified = clerkUser.primaryPhoneNumber?.verification?.status === "verified";
  const avatarUrl = clerkUser.imageUrl || null;
  const displayName =
    clerkUser.fullName || clerkUser.username || clerkUser.firstName || null;

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase
    .from("users")
    .select("id, verified_at, username")
    .eq("clerk_id", userId)
    .maybeSingle();

  const derivedUsername =
    existing?.username ||
    clerkUser.username ||
    clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    `user_${clerkUser.id.slice(0, 6)}`;

  const verifiedAt =
    phoneVerified && !existing?.verified_at ? new Date().toISOString() : existing?.verified_at ?? null;

  const { data: upserted } = await supabase
    .from("users")
    .upsert(
      {
        clerk_id: clerkUser.id,
        username: derivedUsername,
        email,
        phone,
        display_name: displayName,
        avatar_url: avatarUrl,
        phone_verified: phoneVerified,
        email_verified: emailVerified,
        is_verified: phoneVerified,
        verified_at: verifiedAt,
      },
      { onConflict: "clerk_id" },
    )
    .select("id")
    .single();

  if (!upserted) {
    return NextResponse.json({ error: "Unable to sync profile." }, { status: 500 });
  }

  await ensureDefaultCollections(upserted.id);
  const breakdown = await updateTrustScore({ clerkId: userId, phoneVerified, emailVerified });

    return NextResponse.json({ success: true, trustScore: breakdown?.total ?? null });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
