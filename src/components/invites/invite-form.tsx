"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InviteForm() {
  const { user } = useUser();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleInvite() {
    if (!phone.trim()) {
      setStatus("Enter a phone number.");
      return;
    }
    setIsSending(true);
    setStatus("Sending...");
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ phone: phone.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus(data?.error || "Unable to send invite.");
        return;
      }

      setPhone("");
      setStatus("Invite sent.");
    } catch {
      setStatus("Invite failed. Check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="+1 (555) 123-4567"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button onClick={handleInvite} disabled={!phone.trim() || isSending}>
          {isSending ? "Sending..." : "Send Invite"}
        </Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
