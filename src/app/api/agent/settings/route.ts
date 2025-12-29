import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  tone: z.enum(["casual", "professional", "minimal"]).optional(),
  proactivity: z.enum(["high", "medium", "low"]).optional(),
  verbosity: z.enum(["detailed", "concise", "tldr"]).optional(),
  workHours: z
    .object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
      timezone: z.string(),
    })
    .optional(),
  enabledChannels: z
    .object({
      sms: z.boolean(),
      whatsapp: z.boolean(),
      web: z.boolean(),
    })
    .optional(),
});

export async function GET(request: Request) {
  let { userId } = await auth();
  if (!userId && process.env.DEV_BYPASS_AUTH === "true") {
    const headerId = request.headers.get("x-clerk-user-id");
    if (headerId) userId = headerId;
  }
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("users")
    .select("agent_settings")
    .eq("clerk_id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data?.agent_settings ?? {} });
}

export async function PATCH(request: Request) {
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
    return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("users")
    .update({ agent_settings: parsed.data })
    .eq("clerk_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
