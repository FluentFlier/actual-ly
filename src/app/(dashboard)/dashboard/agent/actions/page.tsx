"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Action = {
  id: string;
  action_type: string;
  status?: string | null;
  input_text?: string | null;
  output_text?: string | null;
  created_at: string;
  time_saved_seconds?: number | null;
};

const actionTypes = [
  "all",
  "chat",
  "summary",
  "save_link",
  "reminder",
  "calendar",
  "email",
] as const;

export default function AgentActionsPage() {
  const { user, isLoaded } = useUser();
  const [actions, setActions] = useState<Action[]>([]);
  const [type, setType] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    const params = new URLSearchParams();
    if (type && type !== "all") params.set("type", type);
    if (query.trim()) params.set("q", query.trim());
    const url = params.size ? `/api/agent/actions?${params.toString()}` : "/api/agent/actions";
    fetch(url, {
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => setActions(data?.actions ?? []))
      .catch(() => setActions([]));
  }, [isLoaded, type, query, user?.id]);

  const timeSaved = useMemo(() => {
    return actions.reduce((total, action) => total + (action.time_saved_seconds ?? 0), 0);
  }, [actions]);

  function handleExport() {
    const rows = [
      ["Type", "Input", "Output", "Status", "Created", "TimeSavedSeconds"],
      ...actions.map((action) => [
        action.action_type,
        action.input_text ?? "",
        action.output_text ?? "",
        action.status ?? "completed",
        new Date(action.created_at).toISOString(),
        String(action.time_saved_seconds ?? 0),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agent-actions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search actions"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full max-w-xs"
            />
            <div className="flex flex-wrap gap-2">
              {actionTypes.map((item) => (
                <Button
                  key={item}
                  variant={type === item ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setType(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export CSV
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Estimated time saved: {Math.round(timeSaved / 60)} minutes
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-6">
          {actions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No actions yet.</p>
          ) : (
            actions.map((action) => (
              <div key={action.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{action.action_type}</span>
                  <Badge
                    variant={action.status === "failed" ? "outline" : "outline"}
                    className={action.status === "failed" ? "text-red-500 border-red-200" : undefined}
                  >
                    {action.status || "completed"}
                  </Badge>
                </div>
                {action.output_text ? (
                  <p className="mt-2 text-xs text-muted-foreground">{action.output_text}</p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(action.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
