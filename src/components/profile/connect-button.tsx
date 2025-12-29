"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "none" | "pending" | "requested" | "accepted";

export function ConnectButton({ targetUserId }: { targetUserId: string }) {
  const [status, setStatus] = useState<Status>("none");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/connections/status?targetUserId=${targetUserId}`)
      .then((res) => res.json())
      .then((data) => setStatus(data?.status ?? "none"))
      .catch(() => setStatus("none"));
  }, [targetUserId]);

  async function handleConnect() {
    setIsLoading(true);
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    });
    const data = await res.json();
    setStatus(data?.status ?? "pending");
    setIsLoading(false);
  }

  if (status === "accepted") {
    return <Button variant="secondary">Connected</Button>;
  }

  if (status === "pending") {
    return <Button variant="outline">Request sent</Button>;
  }

  if (status === "requested") {
    return (
      <Button onClick={handleConnect} disabled={isLoading}>
        Accept
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={isLoading}>
      {isLoading ? "Connecting..." : "Connect"}
    </Button>
  );
}
