"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Settings = {
  tone?: "casual" | "professional" | "minimal";
  proactivity?: "high" | "medium" | "low";
  verbosity?: "detailed" | "concise" | "tldr";
  enabledChannels?: {
    sms: boolean;
    whatsapp: boolean;
    web: boolean;
  };
};

const defaultSettings: Settings = {
  tone: "professional",
  proactivity: "medium",
  verbosity: "concise",
  enabledChannels: { sms: false, whatsapp: false, web: true },
};

export function AgentSettingsForm() {
  const { user } = useUser();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agent/settings", {
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings({ ...defaultSettings, ...data.settings });
        }
      })
      .catch(() => null);
  }, [user?.id]);

  async function handleSave() {
    setStatus("Saving...");
    const res = await fetch("/api/agent/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify(settings),
    });

    if (!res.ok) {
      setStatus("Unable to save settings.");
      return;
    }

    setStatus("Saved.");
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold">Tone</p>
        <div className="flex flex-wrap gap-2">
          {["casual", "professional", "minimal"].map((tone) => (
            <Button
              key={tone}
              variant={settings.tone === tone ? "primary" : "outline"}
              size="sm"
              onClick={() => setSettings((prev) => ({ ...prev, tone: tone as Settings["tone"] }))}
            >
              {tone}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold">Proactivity</p>
        <div className="flex flex-wrap gap-2">
          {["high", "medium", "low"].map((level) => (
            <Button
              key={level}
              variant={settings.proactivity === level ? "primary" : "outline"}
              size="sm"
              onClick={() =>
                setSettings((prev) => ({ ...prev, proactivity: level as Settings["proactivity"] }))
              }
            >
              {level}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold">Verbosity</p>
        <div className="flex flex-wrap gap-2">
          {["detailed", "concise", "tldr"].map((level) => (
            <Button
              key={level}
              variant={settings.verbosity === level ? "primary" : "outline"}
              size="sm"
              onClick={() =>
                setSettings((prev) => ({ ...prev, verbosity: level as Settings["verbosity"] }))
              }
            >
              {level}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold">Channels</p>
        <div className="flex flex-wrap gap-2">
          {(["sms", "whatsapp", "web"] as const).map((channel) => (
            <Button
              key={channel}
              variant={settings.enabledChannels?.[channel] ? "primary" : "outline"}
              size="sm"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  enabledChannels: {
                    ...prev.enabledChannels,
                    [channel]: !prev.enabledChannels?.[channel],
                  },
                }))
              }
            >
              {channel}
            </Button>
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save Settings</Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
