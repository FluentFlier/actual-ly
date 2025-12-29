import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteForm } from "@/components/invites/invite-form";

export default function InvitesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Friends</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Send a private SMS invite to verified humans. We’ll ask them to verify
          their phone and email.
        </p>
        <InviteForm />
      </CardContent>
    </Card>
  );
}
