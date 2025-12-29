import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrivacySettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Control who can see your profile, contact you, and use your agent.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold">Profile visibility</p>
            <p className="text-xs text-muted-foreground">Verified humans only</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold">Messages</p>
            <p className="text-xs text-muted-foreground">Connections only</p>
          </div>
        </div>
        <Button variant="outline" disabled>
          More privacy controls coming soon
        </Button>
      </CardContent>
    </Card>
  );
}
