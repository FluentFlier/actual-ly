import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
  "Google Calendar",
  "Gmail",
  "Notion",
  "Linear",
  "Slack",
  "Twitter/X",
  "LinkedIn",
  "GitHub",
];

export default function IntegrationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {integrations.map((name) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
          >
            <span>{name}</span>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
