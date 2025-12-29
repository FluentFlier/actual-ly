import { AgentChat } from "@/components/agent/agent-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Mail, Sparkles } from "lucide-react";

export default function AgentPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="lg:row-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Agent Chat</CardTitle>
            <Badge variant="success">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AgentChat />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Agent Power Moves</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-xl border border-border p-3">
            <p className="font-semibold">Schedule meetings</p>
            <p className="text-xs text-muted-foreground">
              “Meet Maddie tomorrow at 4pm, 30 mins, Zoom.”
            </p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="font-semibold">Save links fast</p>
            <p className="text-xs text-muted-foreground">
              “Save this link and remind me next week.”
            </p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="font-semibold">Send a quick email</p>
            <p className="text-xs text-muted-foreground">
              “Email Ryan a follow up about the demo.”
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Integrations Ready</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Google Calendar
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Gmail
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            WhatsApp Agent
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/settings/integrations">Connect Google</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";
