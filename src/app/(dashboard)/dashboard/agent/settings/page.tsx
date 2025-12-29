import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentSettingsForm } from "@/components/agent/agent-settings-form";

export default function AgentSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Personalize your agent tone, proactivity, and channels. These settings are
          stored in Supabase when you save.
        </p>
        <AgentSettingsForm />
      </CardContent>
    </Card>
  );
}
