import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrustBreakdown } from "@/lib/data/insights";

export default async function TrustInsightsPage() {
  const { userId } = auth();
  const breakdown = userId ? await getTrustBreakdown(userId) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold">{breakdown?.total ?? 0} / 100</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Phone Verified</p>
              <p className="text-xl font-semibold">{breakdown?.humanVerification ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Email Verified</p>
              <p className="text-xl font-semibold">{breakdown?.email ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Account Age</p>
              <p className="text-xl font-semibold">{breakdown?.accountAge ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Network</p>
              <p className="text-xl font-semibold">{breakdown?.connections ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase text-muted-foreground">Engagement</p>
              <p className="text-xl font-semibold">{breakdown?.engagement ?? 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
