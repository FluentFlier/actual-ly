import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInsightsOverview } from "@/lib/data/insights";

export default async function InsightsPage() {
  const { userId } = auth();
  const overview = userId ? await getInsightsOverview(userId) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Trust Score</p>
            <p className="text-2xl font-semibold">{overview?.trustScore ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Agent Actions</p>
            <p className="text-2xl font-semibold">{overview?.actionCount ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Connections</p>
            <p className="text-2xl font-semibold">{overview?.connectionsCount ?? 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
