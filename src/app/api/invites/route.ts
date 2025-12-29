import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getTwilioClient } from "@/lib/twilio/client";

const schema = z.object({
  phone: z.string().min(8).max(30),
});

export async function POST(request: Request) {
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
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id, display_name, username")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3010"}/sign-up`;
  const sender =
    process.env.INVITE_FROM_NAME || user.display_name || user.username || "A friend";

  try {
    const client = getTwilioClient();
    if (!process.env.TWILIO_PHONE_NUMBER) {
      return NextResponse.json({ error: "Twilio phone number missing" }, { status: 500 });
    }

    await client.messages.create({
      to: parsed.data.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `${sender} invited you to Actual.ly. Verify your phone + email here: ${inviteUrl}`,
    });

    await supabase.from("invites").insert({
      inviter_id: user.id,
      phone: parsed.data.phone,
      status: "sent",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to send invite" }, { status: 500 });
  }
}
