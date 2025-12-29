import { NextResponse } from "next/server";
import { getSupabasePublic } from "@/lib/supabase/public";

const USERNAME_REGEX = /^[a-z0-9_]{10,50}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim().toLowerCase() || "";

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json(
      { error: "Invalid username format.", available: false },
      { status: 400 },
    );
  }

  const supabase = getSupabasePublic();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message, available: false }, { status: 500 });
  }

  return NextResponse.json({ available: !data });
}
