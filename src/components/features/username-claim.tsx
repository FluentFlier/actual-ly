"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const USERNAME_REGEX = /^[a-z0-9_]{10,50}$/;

type Availability = "idle" | "checking" | "available" | "taken" | "invalid";

export function UsernameClaim() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<Availability>("idle");
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => USERNAME_REGEX.test(username), [username]);

  useEffect(() => {
    if (!username.length) {
      setStatus("idle");
      setError(null);
      return;
    }

    if (!isValid) {
      setStatus("invalid");
      setError("Usernames must be 10-50 chars: lowercase letters, numbers, _ only.");
      return;
    }

    setStatus("checking");
    setError(null);
    const handle = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/username-available?username=${username}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Unable to check username");
        setStatus(data.available ? "available" : "taken");
        if (!data.available) {
          setError("That username is taken.");
        }
      } catch (err) {
        setStatus("idle");
        setError(err instanceof Error ? err.message : "Unable to check username.");
      }
    }, 450);

    return () => window.clearTimeout(handle);
  }, [username, isValid]);

  async function handleSubmit() {
    if (!isValid) return;
    if (!isSignedIn) {
      router.push(`/sign-up?username=${username}`);
      return;
    }

    const res = await fetch("/api/auth/claim-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      router.push("/verify");
      return;
    }

    const data = await res.json();
    setError(data?.error || "Unable to claim username.");
  }

  return (
    <div className="w-full max-w-xl space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value.trim().toLowerCase())}
            placeholder="claim your username"
            className={cn(
              status === "available" && "border-emerald-400",
              status === "taken" && "border-rose-400",
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {status === "checking" ? "Checking…" : status === "available" ? "Available" : null}
          </span>
        </div>
        <Button onClick={handleSubmit} size="lg" className="w-full sm:w-auto">
          Get started
        </Button>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
