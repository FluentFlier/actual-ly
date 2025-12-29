import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export default async function NetworkInsightsPage() {
  const { userId } = await auth();
  const supabase = getSupabaseAdmin();
  const { data: user } = userId
    ? await supabase.from("users").select("id").eq("clerk_id", userId).single()
    : { data: null };

  const { data: connections } = user
    ? await supabase
        .from("connections")
        .select("status")
        .or(`requester_id.eq.${user.id},requestee_id.eq.${user.id}`)
    : { data: [] };

  const accepted = (connections ?? []).filter((item) => item.status === "accepted").length;
  const pending = (connections ?? []).filter((item) => item.status !== "accepted").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Verified Connections</p>
            <p className="text-2xl font-semibold">{accepted}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Pending Requests</p>
            <p className="text-2xl font-semibold">{pending}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Invite more verified humans to grow your trusted network.
        </p>
      </CardContent>
    </Card>
  );
}
