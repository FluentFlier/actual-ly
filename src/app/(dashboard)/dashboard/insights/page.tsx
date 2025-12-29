import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, Users, Clock } from "lucide-react";
import { getInsightsOverview } from "@/lib/data/insights";

export default async function InsightsPage() {
  const { userId } = await auth();
  const overview = userId ? await getInsightsOverview(userId) : null;

  const breakdownEntries = Object.entries(overview?.actionBreakdown ?? {}).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Insights Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                <Shield className="h-4 w-4" /> Trust Score
              </div>
              <p className="text-2xl font-semibold">{overview?.trustScore ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                <Activity className="h-4 w-4" /> Agent Actions
              </div>
              <p className="text-2xl font-semibold">{overview?.actionCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                <Users className="h-4 w-4" /> Connections
              </div>
              <p className="text-2xl font-semibold">{overview?.connectionsCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                <Clock className="h-4 w-4" /> Time Saved
              </div>
              <p className="text-2xl font-semibold">
                {Math.round((overview?.timeSavedSeconds ?? 0) / 60)} min
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {breakdownEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No actions recorded yet.</p>
          ) : (
            breakdownEntries.map(([type, count]) => (
              <div key={type} className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-sm font-medium capitalize">{type}</span>
                <span className="text-sm text-muted-foreground">{count}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
