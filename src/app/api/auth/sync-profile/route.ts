import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { updateTrustScore } from "@/lib/data/users";

export async function POST() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const clerkUser = await clerkClient.users.getUser(userId);
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
    .select("id, verified_at")
    .eq("clerk_id", userId)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const verifiedAt = phoneVerified && !existing.verified_at ? new Date().toISOString() : existing.verified_at;

  await supabase
    .from("users")
    .update({
      email,
      phone,
      display_name: displayName,
      avatar_url: avatarUrl,
      phone_verified: phoneVerified,
      email_verified: emailVerified,
      is_verified: phoneVerified,
      verified_at: verifiedAt,
    })
    .eq("clerk_id", userId);

  const breakdown = await updateTrustScore({ clerkId: userId, phoneVerified, emailVerified });

  return NextResponse.json({ success: true, trustScore: breakdown?.total ?? null });
}
