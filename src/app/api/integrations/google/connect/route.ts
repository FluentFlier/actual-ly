import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") || "/dashboard/settings/integrations";
  const encoded = encodeURIComponent(redirect);
  const signInUrl = `/sign-in?redirect_url=${encoded}&sign_in_force_redirect_url=${encoded}`;
  return NextResponse.json({ url: signInUrl });
}
