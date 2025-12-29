"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender?: { username?: string | null; display_name?: string | null } | null;
  recipient?: { username?: string | null; display_name?: string | null } | null;
};

export default function MessagesPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [recipientUsername, setRecipientUsername] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/messages", {
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data?.messages ?? []))
      .catch(() => setMessages([]));
  }, [user?.id]);

  async function handleSend() {
    if (!recipientUsername.trim() || !content.trim()) {
      setStatus("Add a recipient and message.");
      return;
    }
    setStatus("Sending...");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify({
        recipientUsername: recipientUsername.trim(),
        content: content.trim(),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data?.error || "Unable to send.");
      return;
    }
    setRecipientUsername("");
    setContent("");
    setStatus("Sent!");
    setMessages((prev) => [data.message, ...prev]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
              <div className="rounded-2xl bg-muted p-3">
                <MessageSquare className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="rounded-2xl border border-border/70 p-4">
                <p className="text-sm font-semibold">
                  {message.sender?.display_name || message.sender?.username || "Unknown"}
                </p>
                <p className="text-sm text-muted-foreground">{message.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>New message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Recipient username"
            value={recipientUsername}
            onChange={(event) => setRecipientUsername(event.target.value)}
          />
          <Input
            placeholder="Message"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button onClick={handleSend}>Send</Button>
            {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
