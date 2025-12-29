import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/auth/admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const isAdmin = await isAdminUser(userId);
  return NextResponse.json({ isAdmin });
}
