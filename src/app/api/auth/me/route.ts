import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/data/users";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);
  return NextResponse.json({ user });
}
