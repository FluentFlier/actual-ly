import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Bot,
  CalendarDays,
  ClipboardList,
  Rss,
  Send,
  Users,
} from "lucide-react";
import { getDashboardStats } from "@/lib/data/dashboard";
import { getAgentActions } from "@/lib/data/agent";
import { getUpcomingReminders } from "@/lib/data/reminders";
import { getGoogleAccessToken } from "@/lib/integrations/google";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId && process.env.DEV_BYPASS_AUTH !== "true") {
    redirect("/sign-in");
  }

  const stats = userId ? await getDashboardStats(userId) : null;
  const recentActions = userId ? await getAgentActions(userId) : [];
  const reminders = userId ? await getUpcomingReminders(userId) : [];
  const googleConnected = userId ? Boolean(await getGoogleAccessToken(userId)) : false;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Actual.ly Control Room</p>
            <h1 className="text-3xl font-semibold md:text-4xl">Your verified network, now automated.</h1>
            <p className="max-w-xl text-sm text-slate-200">
              Your agent is ready to schedule meetings, save links, and keep your network honest.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="bg-white/90 text-slate-900 hover:bg-white">
              <Link href="/dashboard/agent">
                <Bot className="mr-2 h-4 w-4" />
                Ask Agent
              </Link>
            </Button>
            <Button asChild variant="secondary" className="border border-white/20 bg-white/10 text-white hover:bg-white/20">
              <Link href="/dashboard/feed">
                <Rss className="mr-2 h-4 w-4" />
                Open Feed
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" /> Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats?.trustScore ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">Verified signals across your network.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" /> Links Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats?.savedCount ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">Auto-saved from your agent summaries.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" /> Agent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats?.actionCount ?? 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">Tasks completed this week.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/dashboard/agent">
                <Bot className="mr-2 h-4 w-4" /> Ask Agent
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/feed">
                <Send className="mr-2 h-4 w-4" /> New Post
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/feed">
                <Rss className="mr-2 h-4 w-4" /> Check Feed
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/invites">
                <Users className="mr-2 h-4 w-4" /> Invite
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2">
              <span>Google Calendar</span>
              <Badge variant={googleConnected ? "success" : "outline"}>
                {googleConnected ? "Connected" : "Not connected"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2">
              <span>Gmail</span>
              <Badge variant={googleConnected ? "success" : "outline"}>
                {googleConnected ? "Connected" : "Not connected"}
              </Badge>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/settings/integrations">Manage integrations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" /> Recent Agent Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No actions yet.</p>
            ) : (
              recentActions.slice(0, 4).map((action) => (
                <div key={action.id} className="rounded-xl border border-border/70 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{action.action_type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(action.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {action.output_text || "Action completed."}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" /> Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reminders queued.</p>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className="rounded-xl border border-border/70 p-3 text-sm">
                  <p className="font-medium">{reminder.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reminder.remind_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/agent">Ask agent to add one</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
