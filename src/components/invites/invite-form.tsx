"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InviteForm() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleInvite() {
    setStatus("Sending...");
    const res = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      const data = await res.json();
      setStatus(data?.error || "Unable to send invite.");
      return;
    }

    setPhone("");
    setStatus("Invite sent.");
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="+1 (555) 123-4567"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button onClick={handleInvite} disabled={!phone.trim()}>
          Send Invite
        </Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
