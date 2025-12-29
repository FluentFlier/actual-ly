import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield, Users } from "lucide-react";
import { getInsightsOverview } from "@/lib/data/insights";

export default async function InsightsPage() {
  const { userId } = await auth();
  const overview = userId ? await getInsightsOverview(userId) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
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
        </div>
      </CardContent>
    </Card>
  );
}
