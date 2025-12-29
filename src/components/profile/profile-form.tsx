"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  display_name?: string | null;
  bio?: string | null;
  username?: string | null;
};

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile>({});
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => setProfile(data.profile || {}))
      .catch(() => null);
  }, []);

  async function handleSave() {
    setStatus("Saving...");
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: profile.display_name,
        bio: profile.bio,
      }),
    });

    if (!res.ok) {
      setStatus("Unable to save.");
      return;
    }

    setStatus("Saved.");
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold">Display name</label>
        <Input
          value={profile.display_name ?? ""}
          onChange={(event) =>
            setProfile((prev) => ({ ...prev, display_name: event.target.value }))
          }
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Bio</label>
        <Textarea
          maxLength={160}
          value={profile.bio ?? ""}
          onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Save</Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
