import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isAdminUser } from "@/lib/auth/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AgentLogsPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await isAdminUser(userId);
  if (!isAdmin) {
    redirect("/dashboard");
  }

  const supabase = getSupabaseAdmin();
  const { data: actions } = await supabase
    .from("agent_actions")
    .select("id, action_type, input_text, output_text, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions?.length ? (
          actions.map((action) => (
            <div key={action.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{action.action_type}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(action.created_at).toLocaleString()}
                </p>
              </div>
              {action.input_text ? (
                <p className="mt-2 text-xs text-muted-foreground">Input: {action.input_text}</p>
              ) : null}
              <p className="mt-1 text-sm">{action.output_text || "No output"}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No agent actions yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
