import { extractUrls, fetchMetadata } from "@/lib/agent/link-metadata";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { executeAgentActions } from "@/lib/agent/action-executor";

export async function handleAgentMessage({
  clerkId,
  message,
  channel,
}: {
  clerkId: string;
  message: string;
  channel: "web" | "sms";
}) {
  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  if (!user) {
    throw new Error("User not found");
  }

  const urls = extractUrls(message);
  const metadata = urls.length ? await fetchMetadata(urls[0]) : null;

  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error("CEREBRAS_API_KEY is missing");
  }

  const model = process.env.CEREBRAS_MODEL || "llama-3.3-70b";
  const systemPrompt =
    "You are the Actual.ly AI agent. Respond ONLY as JSON with keys: reply (string) and actions (array). Actions types: save_link {url, title?, collection?}, create_reminder {title?, remind_at ISO8601}, create_calendar_event {title?, start_at ISO8601, end_at?}. If no action, return empty actions array. Use ISO8601 times in the user's local timezone if given. Be concise and proactive.";

  const userPrompt = metadata
    ? `User message: ${message}

Link metadata:
Title: ${metadata.title}
Description: ${metadata.description}
Domain: ${metadata.domain}

Provide a summary and one recommended action.`
    : `User message: ${message}
Respond with helpful next steps.`;

  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Cerebras request failed");
  }

  const data = await response.json();
  const rawText = String(data?.choices?.[0]?.message?.content || "").trim();
  const parsed = extractJson(rawText);

  const reply = typeof parsed?.reply === "string" ? parsed.reply.trim() : rawText;
  const actions = normalizeActions(Array.isArray(parsed?.actions) ? parsed.actions : []);

  await supabase.from("agent_actions").insert({
    user_id: user.id,
    action_type: metadata ? "summary" : "chat",
    input_text: message,
    output_text: reply,
    metadata: metadata ? { url: metadata.url, title: metadata.title } : {},
  });

  const { data: conversation } = await supabase
    .from("agent_conversations")
    .select("id, messages")
    .eq("user_id", user.id)
    .eq("channel", channel)
    .maybeSingle();

  const updatedMessages = [
    ...(conversation?.messages ?? []),
    { role: "user", content: message, at: new Date().toISOString() },
    { role: "assistant", content: reply, at: new Date().toISOString() },
  ];

  if (conversation) {
    await supabase
      .from("agent_conversations")
      .update({ messages: updatedMessages })
      .eq("id", conversation.id);
  } else {
    await supabase
      .from("agent_conversations")
      .insert({ user_id: user.id, channel, messages: updatedMessages });
  }

  const actionResults = await executeAgentActions({ userId: user.id, actions });

  if (metadata && actions.length === 0) {
    await executeAgentActions({
      userId: user.id,
      actions: [
        {
          type: "save_link",
          url: metadata.url,
          title: metadata.title,
          collection: /job|career|apply/i.test(metadata.title) ? "Jobs" : "Reading List",
        },
      ],
    });
  }

  return actionResults.length ? `${reply}\n\n${actionResults.join(" ")}` : reply;
}

function normalizeActions(actions: unknown[]) {
  return actions
    .map((action) => {
      if (typeof action !== "object" || !action) return null;
      const { type, url, title, collection, remind_at, start_at, end_at, note } =
        action as Record<string, string>;
      if (!type) return null;
      return {
        type,
        url,
        title,
        collection,
        remind_at,
        start_at,
        end_at,
        note,
      };
    })
    .filter(Boolean);
}

function extractJson(raw: string) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}
