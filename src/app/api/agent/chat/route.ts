import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { handleAgentMessage } from "@/lib/agent/handle-message";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { message } = (await request.json()) as { message?: string };
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  try {
    const responseText = await handleAgentMessage({
      clerkId: userId,
      message,
      channel: "web",
    });

    return NextResponse.json({ response: responseText });
  } catch {
    return NextResponse.json({ error: "Agent unavailable" }, { status: 502 });
  }
}
