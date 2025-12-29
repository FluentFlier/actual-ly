import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const schema = z.object({
  index: z.number().int().nonnegative(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  let { userId } = auth();
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
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: post } = await supabase
    .from("posts")
    .select("poll_options")
    .eq("id", params.id)
    .maybeSingle();

  const options = Array.isArray(post?.poll_options) ? post.poll_options : [];
  if (!options[parsed.data.index]) {
    return NextResponse.json({ error: "Option not found" }, { status: 404 });
  }

  const updated = options.map((option: any, idx: number) =>
    idx === parsed.data.index
      ? { ...option, votes: (option.votes ?? 0) + 1 }
      : option,
  );

  await supabase.from("posts").update({ poll_options: updated }).eq("id", params.id);

  return NextResponse.json({ poll_options: updated });
}
