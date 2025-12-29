import { NextResponse } from "next/server";
import twilio from "twilio";
import { handleAgentMessage } from "@/lib/agent/handle-message";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const from = String(formData.get("From") || "");
  const body = String(formData.get("Body") || "");

  const signature = request.headers.get("x-twilio-signature") || "";
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  try {
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    if (!authToken) {
      return new NextResponse("Twilio auth token missing", { status: 500 });
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const url = new URL(request.url);
    const basePath = `${url.pathname}${url.search}`;
    const candidates = new Set<string>();

    candidates.add(request.url);
    if (host) {
      candidates.add(`${proto}://${host}${basePath}`);
      candidates.add(`${proto}://${host}${url.pathname}`);
    }

    let valid = false;
    for (const candidate of candidates) {
      if (twilio.validateRequest(authToken, signature, candidate, params)) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      console.warn("Twilio signature invalid", {
        host,
        proto,
        candidates: Array.from(candidates),
      });
      return new NextResponse("Invalid signature", { status: 403 });
    }
  } catch {
    return new NextResponse("Signature validation failed", { status: 403 });
  }

  if (!from || !body) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user } = await supabase
    .from("users")
    .select("clerk_id")
    .eq("phone", from)
    .maybeSingle();

  if (!user?.clerk_id) {
    return new NextResponse("User not found", { status: 404 });
  }

  try {
    const responseText = await handleAgentMessage({
      clerkId: user.clerk_id,
      message: body,
      channel: "sms",
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(responseText)}</Message>
</Response>`;

    return new NextResponse(xml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch {
    return new NextResponse("Agent unavailable", { status: 502 });
  }
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
