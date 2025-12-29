"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Connection = {
  id: string;
  status: "pending" | "accepted" | "declined";
  direction: "incoming" | "outgoing";
  created_at: string;
  otherUser?: {
    id: string;
    username?: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
    is_verified?: boolean | null;
  } | null;
};

const filters = [
  { key: "accepted", label: "Connected" },
  { key: "incoming", label: "Requests" },
  { key: "outgoing", label: "Pending" },
  { key: "declined", label: "Declined" },
] as const;

export default function ConnectionsPage() {
  const { user, isLoaded } = useUser();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]["key"]>("accepted");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/connections", {
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => setConnections(data?.connections ?? []))
      .catch(() => setConnections([]));
  }, [isLoaded, user?.id]);

  const filtered = useMemo(() => {
    return connections.filter((connection) => {
      if (activeFilter === "accepted") return connection.status === "accepted";
      if (activeFilter === "declined") return connection.status === "declined";
      return connection.direction === activeFilter && connection.status === "pending";
    });
  }, [connections, activeFilter]);

  async function handleAction(connectionId: string, action: "accept" | "decline") {
    setStatus("Updating...");
    const res = await fetch(`/api/connections/${connectionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data?.error || "Unable to update connection.");
      return;
    }
    setConnections((prev) =>
      prev.map((connection) =>
        connection.id === connectionId
          ? { ...connection, status: data?.connection?.status ?? connection.status }
          : connection,
      ),
    );
    setStatus("Updated.");
  }

  async function handleRemove(connectionId: string) {
    setStatus("Removing...");
    const res = await fetch(`/api/connections/${connectionId}`, {
      method: "DELETE",
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    });
    if (!res.ok) {
      setStatus("Unable to remove.");
      return;
    }
    setConnections((prev) => prev.filter((connection) => connection.id !== connectionId));
    setStatus("Removed.");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilter === filter.key ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
          {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No connections in this view.
            </CardContent>
          </Card>
        ) : (
          filtered.map((connection) => (
            <Card key={connection.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      {connection.otherUser?.display_name ||
                        connection.otherUser?.username ||
                        "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{connection.otherUser?.username || "unknown"}
                    </p>
                  </div>
                  {connection.otherUser?.is_verified ? (
                    <Badge variant="success">Verified</Badge>
                  ) : (
                    <Badge variant="outline">Unverified</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {connection.status === "accepted" ? (
                    <Button variant="outline" size="sm" onClick={() => handleRemove(connection.id)}>
                      Remove
                    </Button>
                  ) : null}
                  {connection.direction === "incoming" && connection.status === "pending" ? (
                    <>
                      <Button size="sm" onClick={() => handleAction(connection.id, "accept")}>
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(connection.id, "decline")}
                      >
                        Decline
                      </Button>
                    </>
                  ) : null}
                  {connection.direction === "outgoing" && connection.status === "pending" ? (
                    <Button variant="outline" size="sm" onClick={() => handleRemove(connection.id)}>
                      Cancel request
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
