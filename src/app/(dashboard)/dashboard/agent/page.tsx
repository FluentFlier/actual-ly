import { AgentChat } from "@/components/agent/agent-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentChat />
        </CardContent>
      </Card>
    </div>
  );
}
