import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteForm } from "@/components/invites/invite-form";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users } from "lucide-react";

export default function InvitesPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Invite Friends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Bring verified humans into your trusted network.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Send a private SMS invite. We’ll guide them through phone + email verification.
          </p>
          <InviteForm />
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Verified‑only access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-200">
          <p>Invites are limited to keep Actual.ly real. Each person verifies once.</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Phone check</Badge>
            <Badge variant="outline">Email check</Badge>
            <Badge variant="outline">Trust score</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
