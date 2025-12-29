import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchMetadata } from "@/lib/agent/link-metadata";

const schema = z.object({
  content: z.string().min(1).max(500),
  type: z.enum(["text", "link", "poll", "job", "collab", "question"]).default("text"),
  linkUrl: z.string().url().optional(),
  pollOptions: z.array(z.string().min(1).max(100)).optional(),
});

export async function POST(request: Request) {
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
    return NextResponse.json({ error: "Invalid post" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("users")
    .select("id, trust_score")
    .eq("clerk_id", userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.trust_score < 20) {
    return NextResponse.json({ error: "Trust score too low to post." }, { status: 403 });
  }

  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", dayAgo);

  if ((count ?? 0) >= 10) {
    return NextResponse.json({ error: "Daily post limit reached." }, { status: 429 });
  }

  const linkPreview = parsed.data.linkUrl ? await fetchMetadata(parsed.data.linkUrl) : null;
  let aiSummary: string | null = null;
  if (parsed.data.linkUrl && process.env.CEREBRAS_API_KEY) {
    try {
      const summaryPrompt = `Summarize this link in one sentence for a social feed.\nTitle: ${linkPreview?.title ?? ""}\nDescription: ${linkPreview?.description ?? ""}\nURL: ${parsed.data.linkUrl}`;
      const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.CEREBRAS_MODEL || "llama-3.3-70b",
          max_completion_tokens: 120,
          temperature: 0.3,
          messages: [
            { role: "system", content: "You are a concise summarizer." },
            { role: "user", content: summaryPrompt },
          ],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        aiSummary = String(data?.choices?.[0]?.message?.content || "").trim() || null;
      }
    } catch {
      aiSummary = null;
    }
  }
  const pollPayload =
    parsed.data.type === "poll"
      ? (parsed.data.pollOptions ?? []).map((option) => ({ option, votes: 0 }))
      : null;

  const { error: insertError } = await supabase.from("posts").insert({
    user_id: user.id,
    content: parsed.data.content,
    type: parsed.data.type,
    link_url: parsed.data.linkUrl ?? null,
    poll_options: pollPayload,
    link_preview: linkPreview
      ? {
          title: linkPreview.title,
          description: linkPreview.description,
          image: linkPreview.image,
          url: linkPreview.url,
        }
      : null,
    ai_summary: aiSummary,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
