import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getTwilioClient } from "@/lib/twilio/client";

export const runtime = "nodejs";

function authorize(request: Request) {
  const headerSecret = request.headers.get("x-cron-secret");
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return true;
  }

  return headerSecret === expected || querySecret === expected;
}

export async function GET(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return runReminders();
}

export async function POST(request: Request) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return runReminders();
}

async function runReminders() {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  const { data: reminders, error } = await supabase
    .from("reminders")
    .select("id, user_id, content, remind_at")
    .lte("remind_at", now)
    .eq("status", "pending")
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!reminders?.length) {
    return NextResponse.json({ processed: 0 });
  }

  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
  const client = twilioNumber ? getTwilioClient() : null;

  for (const reminder of reminders) {
    const { data: user } = await supabase
      .from("users")
      .select("phone, agent_settings")
      .eq("id", reminder.user_id)
      .single();

    const smsEnabled = Boolean(user?.agent_settings?.enabledChannels?.sms);
    if (client && twilioNumber && user?.phone && smsEnabled) {
      await client.messages.create({
        to: user.phone,
        from: twilioNumber,
        body: `Actual.ly reminder: ${reminder.content}`,
      });
    }

    await supabase
      .from("reminders")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", reminder.id);

    await supabase.from("agent_actions").insert({
      user_id: reminder.user_id,
      action_type: "reminder_delivery",
      input_text: reminder.content,
      output_text: "Reminder delivered",
      metadata: { remind_at: reminder.remind_at },
    });
  }

  return NextResponse.json({ processed: reminders.length });
}
