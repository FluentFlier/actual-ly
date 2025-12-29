import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchMetadata } from "@/lib/agent/link-metadata";
import { ensureDefaultCollections, getDefaultCollectionId } from "@/lib/data/collections";
import { createGoogleCalendarEvent, getGoogleAccessToken } from "@/lib/integrations/google";

export type AgentActionInput = {
  type: "save_link" | "create_reminder" | "create_calendar_event" | "send_email";
  url?: string;
  remind_at?: string;
  title?: string;
  start_at?: string;
  end_at?: string;
  note?: string;
  location?: string;
  attendees?: string[];
  to?: string;
  subject?: string;
  body?: string;
  collection?: string;
};

const TIME_SAVED_SECONDS: Record<AgentActionInput["type"], number> = {
  save_link: 30,
  create_reminder: 60,
  create_calendar_event: 120,
  send_email: 300,
};

export async function executeAgentActions({
  userId,
  actions,
}: {
  userId: string;
  actions: AgentActionInput[];
}) {
  const supabase = getSupabaseAdmin();
  const results: string[] = [];
  const { data: user } = await supabase
    .from("users")
    .select("clerk_id")
    .eq("id", userId)
    .single();
  const clerkId = user?.clerk_id ?? null;

  for (const action of actions) {
    if (action.type === "save_link" && action.url) {
      const metadata = await fetchMetadata(action.url);
      const collectionName =
        action.collection ||
        (metadata?.title && /job|career|apply/i.test(metadata.title) ? "Jobs" : "Reading List");
      let collectionId = await getDefaultCollectionId(userId, collectionName);
      if (!collectionId) {
        await ensureDefaultCollections(userId);
        collectionId = await getDefaultCollectionId(userId, collectionName);
      }

      await supabase.from("saved_items").insert({
        user_id: userId,
        collection_id: collectionId,
        url: action.url,
        title: metadata?.title || action.title || action.url,
        description: metadata?.description || "",
        image_url: metadata?.image || null,
        ai_summary: action.note || null,
      });

      await supabase.from("agent_actions").insert({
        user_id: userId,
        action_type: "save_link",
        input_text: action.url,
        output_text: `Saved to ${collectionName}.`,
        metadata: { url: action.url, collection: collectionName },
        time_saved_seconds: TIME_SAVED_SECONDS.save_link,
      });

      results.push(`Saved link to ${collectionName}.`);
    }

    if (action.type === "create_reminder" && action.remind_at) {
      const remindAt = new Date(action.remind_at);
      if (!Number.isNaN(remindAt.getTime())) {
        await supabase.from("reminders").insert({
          user_id: userId,
          content: action.title || action.note || "Reminder",
          remind_at: remindAt.toISOString(),
          status: "pending",
        });

        await supabase.from("agent_actions").insert({
          user_id: userId,
          action_type: "reminder",
          input_text: action.title || action.note || "Reminder",
          output_text: `Reminder set for ${remindAt.toLocaleString()}.`,
          metadata: { remind_at: remindAt.toISOString() },
          time_saved_seconds: TIME_SAVED_SECONDS.create_reminder,
        });

        results.push(`Reminder set for ${remindAt.toLocaleString()}.`);
      }
    }

    if (action.type === "create_calendar_event" && action.start_at) {
      const startAt = new Date(action.start_at);
      const endAt = action.end_at ? new Date(action.end_at) : null;
      if (!Number.isNaN(startAt.getTime())) {
        const token = clerkId ? await getGoogleAccessToken(clerkId) : null;
        if (token) {
          const event = await createGoogleCalendarEvent(token, {
            title: action.title || "Calendar event",
            startAt: startAt.toISOString(),
            endAt: endAt?.toISOString() ?? undefined,
            description: action.note,
            location: action.location,
            attendees: action.attendees,
          });

          await supabase.from("agent_actions").insert({
            user_id: userId,
            action_type: "calendar",
            input_text: action.title || "Calendar event",
            output_text: `Calendar event created for ${startAt.toLocaleString()}.`,
            metadata: { event_id: event?.id, start_at: startAt.toISOString(), end_at: endAt?.toISOString() },
            time_saved_seconds: TIME_SAVED_SECONDS.create_calendar_event,
          });

          results.push(`Calendar event added for ${startAt.toLocaleString()}.`);
        } else {
          await supabase.from("reminders").insert({
            user_id: userId,
            content: action.title || "Calendar event",
            remind_at: startAt.toISOString(),
            status: "pending",
          });

          await supabase.from("agent_actions").insert({
            user_id: userId,
            action_type: "calendar",
            input_text: action.title || "Calendar event",
            output_text: "Calendar not connected. Reminder queued instead.",
            metadata: { start_at: startAt.toISOString(), end_at: endAt?.toISOString() },
            time_saved_seconds: TIME_SAVED_SECONDS.create_calendar_event,
          });

          results.push("Google Calendar not connected yet. I queued a reminder instead.");
        }
      }
    }

    if (action.type === "send_email" && action.to && action.subject && action.body) {
      const token = clerkId ? await getGoogleAccessToken(clerkId) : null;
      if (token) {
        const { sendGmailMessage } = await import("@/lib/integrations/google");
        await sendGmailMessage(token, {
          to: action.to,
          subject: action.subject,
          body: action.body,
        });

        await supabase.from("agent_actions").insert({
          user_id: userId,
          action_type: "email",
          input_text: action.subject,
          output_text: `Email sent to ${action.to}.`,
          metadata: { to: action.to, subject: action.subject },
          time_saved_seconds: TIME_SAVED_SECONDS.send_email,
        });

        results.push(`Email sent to ${action.to}.`);
      } else {
        await supabase.from("agent_actions").insert({
          user_id: userId,
          action_type: "email",
          input_text: action.subject,
          output_text: "Gmail not connected.",
          metadata: { to: action.to, subject: action.subject },
          time_saved_seconds: 0,
        });

        results.push("Gmail not connected yet. Connect Google to send emails.");
      }
    }
  }

  return results;
}
