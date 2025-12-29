"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
  "Google Calendar",
  "Gmail",
  "Notion",
  "Linear",
  "Slack",
  "Twitter/X",
  "LinkedIn",
  "GitHub",
];

export default function IntegrationsPage() {
  const { user } = useUser();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/integrations/google/status", {
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => setGoogleConnected(Boolean(data?.connected)))
      .catch(() => setGoogleConnected(false));
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
        {integrations.map((name) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
          >
            <div className="space-y-1">
              <span className="block font-medium">{name}</span>
              {name.startsWith("Google") && (
                <span className="text-xs text-muted-foreground">
                  {googleConnected
                    ? "Connected via Google OAuth"
                    : "Sign in with Google in Clerk to enable this."}
                </span>
              )}
            </div>
            {name.startsWith("Google") ? (
              <div className="flex items-center gap-2">
                <Button
                  variant={googleConnected ? "secondary" : "outline"}
                  size="sm"
                  onClick={async () => {
                    if (googleConnected) return;
                    window.location.href = user?.id
                      ? "/verify?mode=integrations"
                      : "/sign-in?redirect_url=/verify?mode=integrations";
                  }}
                >
                  {googleConnected ? "Connected" : "Connect"}
                </Button>
                {googleConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setStatus("Disconnecting...");
                      const res = await fetch("/api/integrations/google", {
                        method: "DELETE",
                        headers: {
                          ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
                        },
                      });
                      if (res.ok) {
                        setGoogleConnected(false);
                        setStatus("Disconnected.");
                      } else {
                        setStatus("Unable to disconnect.");
                      }
                    }}
                  >
                    Disconnect
                  </Button>
                ) : null}
              </div>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Coming soon
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
