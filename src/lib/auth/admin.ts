import { clerkClient } from "@clerk/nextjs/server";

export async function isAdminUser(userId: string) {
  const emails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!emails.length) {
    return false;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const primary = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  return primary ? emails.includes(primary) : false;
}
