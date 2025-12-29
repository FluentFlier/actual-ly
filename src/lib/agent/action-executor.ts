import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchMetadata } from "@/lib/agent/link-metadata";
import { getDefaultCollectionId } from "@/lib/data/collections";

export type AgentActionInput = {
  type: "save_link" | "create_reminder" | "create_calendar_event";
  url?: string;
  remind_at?: string;
  title?: string;
  start_at?: string;
  end_at?: string;
  note?: string;
  collection?: string;
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

  for (const action of actions) {
    if (action.type === "save_link" && action.url) {
      const metadata = await fetchMetadata(action.url);
      const collectionName = action.collection || (metadata?.title && /job|career|apply/i.test(metadata.title) ? "Jobs" : "Reading List");
      const collectionId = await getDefaultCollectionId(userId, collectionName);

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
        });

        results.push(`Reminder set for ${remindAt.toLocaleString()}.`);
      }
    }

    if (action.type === "create_calendar_event" && action.start_at) {
      const startAt = new Date(action.start_at);
      const endAt = action.end_at ? new Date(action.end_at) : null;
      if (!Number.isNaN(startAt.getTime())) {
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
          output_text: `Calendar event queued for ${startAt.toLocaleString()}.`,
          metadata: { start_at: startAt.toISOString(), end_at: endAt?.toISOString() },
        });

        results.push(`Calendar event queued for ${startAt.toLocaleString()}.`);
      }
    }
  }

  return results;
}
