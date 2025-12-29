"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Settings = {
  tone?: "casual" | "professional" | "minimal";
  proactivity?: "high" | "medium" | "low";
  verbosity?: "detailed" | "concise" | "tldr";
  workHours?: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
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
  workHours: {
    enabled: false,
    start: "09:00",
    end: "18:00",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  enabledChannels: { sms: false, whatsapp: false, web: true },
};

export function AgentSettingsForm() {
  const { user, isLoaded } = useUser();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    setIsLoading(true);
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
      .catch(() => setStatus("Unable to load settings."))
      .finally(() => setIsLoading(false));
  }, [isLoaded, user?.id]);

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
      {isLoading ? <p className="text-sm text-muted-foreground">Loading settings…</p> : null}
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
                setSettings((prev) => {
                  const current = prev.enabledChannels ?? {
                    sms: false,
                    whatsapp: false,
                    web: true,
                  };
                  return {
                    ...prev,
                    enabledChannels: {
                      ...current,
                      [channel]: !current[channel],
                    },
                  };
                })
              }
            >
              {channel}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <p className="text-sm font-semibold">Work hours</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={settings.workHours?.enabled ? "primary" : "outline"}
            size="sm"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                workHours: {
                  ...(prev.workHours ?? defaultSettings.workHours!),
                  enabled: !(prev.workHours?.enabled ?? false),
                },
              }))
            }
          >
            {settings.workHours?.enabled ? "Enabled" : "Disabled"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            type="time"
            value={settings.workHours?.start || "09:00"}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                workHours: {
                  ...(prev.workHours ?? defaultSettings.workHours!),
                  start: event.target.value,
                },
              }))
            }
          />
          <Input
            type="time"
            value={settings.workHours?.end || "18:00"}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                workHours: {
                  ...(prev.workHours ?? defaultSettings.workHours!),
                  end: event.target.value,
                },
              }))
            }
          />
        </div>
        <Input
          value={settings.workHours?.timezone || defaultSettings.workHours?.timezone || "UTC"}
          onChange={(event) =>
            setSettings((prev) => ({
              ...prev,
              workHours: {
                ...(prev.workHours ?? defaultSettings.workHours!),
                timezone: event.target.value,
              },
            }))
          }
          placeholder="Timezone"
        />
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save Settings</Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
