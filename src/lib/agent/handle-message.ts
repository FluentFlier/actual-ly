import { extractUrls, fetchMetadata, fetchPageContent } from "@/lib/agent/link-metadata";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { executeAgentActions } from "@/lib/agent/action-executor";

export async function handleAgentMessage({
  clerkId,
  message,
  channel,
}: {
  clerkId: string;
  message: string;
  channel: "web" | "sms" | "whatsapp";
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

  const lowerMessage = message.toLowerCase();

  if (/(reading list|saved items|saved links|my saved)/i.test(lowerMessage)) {
    const { data: items } = await supabase
      .from("saved_items")
      .select("title, url, collections (name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!items || items.length === 0) {
      return "Your Reading List is empty. Want me to save a link?";
    }

    const list = items
      .map((item, idx) => {
        const title = item.title || item.url;
        return `${idx + 1}. ${title} (${item.url})`;
      })
      .join("\n");

    return `Here are your latest saved items:\n${list}`;
  }

  const urls = extractUrls(message);
  const metadata = urls.length ? await fetchMetadata(urls[0]) : null;
  const pageContent = urls.length ? await fetchPageContent(urls[0]) : null;

  if (/analy[sz]e|mistake|issues|feedback|review/i.test(lowerMessage) && !urls.length) {
    const { data: convo } = await supabase
      .from("agent_conversations")
      .select("messages")
      .eq("user_id", user.id)
      .eq("channel", channel)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const lastUrl = Array.isArray(convo?.messages)
      ? extractUrls(convo.messages.map((m: any) => m.content).join(" "))[0]
      : null;

    if (lastUrl) {
      const content = await fetchPageContent(lastUrl);
      if (content?.text) {
        return await analyzeContentWithAI(content.text, lastUrl);
      }
    }
  }

  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    throw new Error("CEREBRAS_API_KEY is missing");
  }

  const model = process.env.CEREBRAS_MODEL || "llama-3.3-70b";
  const systemPrompt =
    "You are the Actual.ly AI agent. Respond ONLY as JSON with keys: reply (string) and actions (array). Actions types: save_link {url, title?, collection?}, create_reminder {title?, remind_at ISO8601, note?}, create_calendar_event {title?, start_at ISO8601, end_at?, location?, attendees?}, send_email {to, subject, body}. If no action, return empty actions array. If user asks to schedule something, include create_calendar_event. If user asks for a reminder (e.g. '2 hours before'), add create_reminder. If user asks to send an email, include send_email. Use ISO8601 times in the user's local timezone if given. Be concise and proactive.";

  const userPrompt = metadata
    ? `User message: ${message}

Link metadata:
Title: ${metadata.title}
Description: ${metadata.description}
Domain: ${metadata.domain}

Page content (truncated):
${pageContent?.text || "Unavailable"}

Provide a concise summary of the page and one recommended action.`
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
      max_completion_tokens: 400,
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Cerebras error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const rawText = String(data?.choices?.[0]?.message?.content || "").trim();
  const parsed = extractJson(rawText);

  let reply = typeof parsed?.reply === "string" ? parsed.reply.trim() : rawText;
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

  if (actionResults.some((result) => result.includes("not connected"))) {
    reply = `I couldn't access your integration yet. ${reply}`;
  }

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

async function analyzeContentWithAI(text: string, url: string) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    return "I need the Cerebras API key to analyze that content.";
  }

  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.CEREBRAS_MODEL || "llama-3.3-70b",
      max_completion_tokens: 400,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You are a critical reviewer. Point out mistakes or issues clearly and concisely.",
        },
        { role: "user", content: `Analyze this content from ${url}:\n\n${text}` },
      ],
    }),
  });

  if (!response.ok) {
    return "I couldn't analyze the content right now.";
  }

  const data = await response.json();
  return String(data?.choices?.[0]?.message?.content || "").trim();
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
