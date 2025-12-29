import { NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/data/users";

type Context = {
  params: { username: string };
};

export async function GET(_: Request, { params }: Context) {
  const user = await getUserByUsername(params.username);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const publicUser = {
    id: user.id,
    username: user.username,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    trust_score: user.trust_score,
    is_verified: user.is_verified,
    verified_at: user.verified_at,
    created_at: user.created_at,
  };

  return NextResponse.json({ user: publicUser });
}
