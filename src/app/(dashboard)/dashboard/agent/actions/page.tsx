import { auth } from "@clerk/nextjs/server";
import { getAgentActions } from "@/lib/data/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AgentActionsPage() {
  const { userId } = auth();
  const actions = userId ? await getAgentActions(userId) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No actions yet.</p>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="rounded-2xl border border-border/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold capitalize">{action.action_type}</p>
                <Badge variant="outline">{new Date(action.created_at).toLocaleTimeString()}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {action.output_text || "Action completed."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(action.created_at).toLocaleDateString()} · {new Date(action.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
