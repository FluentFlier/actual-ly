import { auth } from "@clerk/nextjs/server";
import { getAgentActions } from "@/lib/data/agent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            <div key={action.id} className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold">{action.action_type}</p>
              <p className="text-sm text-muted-foreground">
                {action.output_text || "Action completed."}
              </p>
              <p className="text-xs text-muted-foreground">{new Date(action.created_at).toLocaleString()}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
