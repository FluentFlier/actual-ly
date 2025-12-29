import { clerkClient } from "@clerk/nextjs/server";

export async function getGoogleAccessToken(clerkId: string) {
  const client = await clerkClient();
  const providers = ["oauth_google", "google"];

  for (const provider of providers) {
    try {
      const tokens = await client.users.getUserOauthAccessToken(clerkId, provider);
      const token = tokens?.[0]?.token;
      if (token) return token;
    } catch {
      continue;
    }
  }

  return null;
}

export async function createGoogleCalendarEvent(
  accessToken: string,
  event: {
    title: string;
    startAt: string;
    endAt?: string;
    description?: string;
    location?: string;
    attendees?: string[];
  },
) {
  const payload = {
    summary: event.title,
    description: event.description,
    location: event.location,
    start: { dateTime: event.startAt },
    end: { dateTime: event.endAt ?? event.startAt },
    attendees: event.attendees?.map((email) => ({ email })) ?? undefined,
  };

  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Calendar error ${response.status}: ${text}`);
  }

  return (await response.json()) as { id?: string };
}

export async function sendGmailMessage(
  accessToken: string,
  email: {
    to: string;
    subject: string;
    body: string;
  },
) {
  const lines = [
    `To: ${email.to}`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
    `Subject: ${email.subject}`,
    "",
    email.body,
  ];
  const raw = Buffer.from(lines.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gmail error ${response.status}: ${text}`);
  }

  return response.json();
}
