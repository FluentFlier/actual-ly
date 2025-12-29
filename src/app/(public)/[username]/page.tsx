import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data/users";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/profile/connect-button";
import Link from "next/link";

type PageProps = {
  params: { username: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const user = await getUserByUsername(params.username);
  if (!user) {
    return { title: "Profile not found" };
  }

  return {
    title: `${user.display_name || user.username} — Actual.ly`,
    description: user.bio || "Verified human profile on Actual.ly",
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar_url} alt={user.display_name || user.username} className="h-16 w-16" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  {user.display_name || user.username}
                </h1>
                {user.is_verified ? <Badge variant="success">Verified</Badge> : null}
              </div>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/messages">Message</Link>
            </Button>
            <ConnectButton targetUserId={user.id} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm uppercase text-muted-foreground">Trust Score</p>
            <div className="mt-2 flex items-center gap-4">
              <p className="text-2xl font-semibold">{user.trust_score} / 100</p>
              <div className="h-2 w-full max-w-sm rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${Math.min(100, user.trust_score)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm uppercase text-muted-foreground">Bio</p>
            <p className="text-base text-foreground">
              {user.bio || "No bio yet. Verified humans keep it real."}
            </p>
          </div>

          <Card className="bg-secondary/60">
            <CardHeader>
              <CardTitle>AI Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Active • Last action: Saved a link to the Jobs collection
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
