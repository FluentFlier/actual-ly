import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSavedItems } from "@/lib/data/saved";

export default async function SavedPage() {
  const { userId } = await auth();
  const items = await getSavedItems(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved items yet.</p>
        ) : (
          items.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-border/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item.title || item.url}</p>
                  <p className="text-xs text-muted-foreground">{item.url}</p>
                </div>
                {item.collections ? (
                  <Badge variant="outline">
                    {item.collections.icon ? `${item.collections.icon} ` : ""}
                    {item.collections.name}
                  </Badge>
                ) : null}
              </div>
              {item.ai_summary ? (
                <p className="mt-2 text-xs text-muted-foreground">AI summary: {item.ai_summary}</p>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
