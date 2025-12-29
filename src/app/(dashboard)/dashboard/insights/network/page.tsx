import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NetworkInsightsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          View new verified connections and the topics your network cares about.
        </p>
      </CardContent>
    </Card>
  );
}
