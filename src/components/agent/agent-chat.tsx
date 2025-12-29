"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AgentChat() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const devBypassEnabled = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true" ||
      process.env.NEXT_PUBLIC_DEV_BYPASS === "true"
    );
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn && !devBypassEnabled) return;
    setIsLoading(true);
    fetch("/api/agent/conversation", {
      credentials: "include",
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.messages)) {
          const restored = data.messages.map((message: Message) => ({
            role: message.role,
            content: message.content,
          }));
          setMessages(restored);
        }
      })
      .catch(() => {
        setError("Unable to load conversation.");
      })
      .finally(() => setIsLoading(false));
  }, [isLoaded, isSignedIn, user?.id, devBypassEnabled]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isSending]);

  async function handleSend() {
    if (!input.trim() || isSending) return;
    if (!isSignedIn && !devBypassEnabled) {
      setError("Sign in to chat with your agent.");
      return;
    }
    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
        },
        body: JSON.stringify({ message: input.trim() }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Sign in to chat with your agent.");
        } else {
          setError("Sorry, I hit a snag. Try again.");
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I hit a snag. Try again." },
        ]);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch {
      setError("Message failed to send. Check your connection and try again.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I hit a snag. Try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  async function handleClear() {
    if (isClearing) return;
    setIsClearing(true);
    setError(null);
    try {
      const res = await fetch("/api/agent/conversation", {
        method: "DELETE",
        headers: {
          ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
        },
      });
      if (res.ok) {
        setMessages([]);
      }
    } catch {
      setError("Unable to clear chat.");
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="flex min-h-[360px] flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Conversation</p>
          <Button size="sm" variant="outline" onClick={handleClear} disabled={isClearing}>
            <Trash2 className="mr-2 h-4 w-4" />
            {isClearing ? "Clearing" : "Clear"}
          </Button>
        </div>
        <div ref={scrollerRef} className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading conversation…</p>
          ) : null}
          {!isLoading && messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Say hello to your agent. Drop a link or ask for a summary.
            </p>
          ) : null}
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[75%] rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground"
                  : "mr-auto max-w-[75%] rounded-2xl bg-muted px-4 py-3 text-sm"
              }
            >
              {message.content}
            </div>
          ))}
          {isSending ? (
            <div className="mr-auto max-w-[75%] rounded-2xl bg-muted px-4 py-3 text-sm">
              Thinking…
            </div>
          ) : null}
        </div>
        {error ? <p className="text-xs text-red-500">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          {[
            "Summarize this link",
            "Save this link to Reading List",
            "Remind me tomorrow at 9am",
            "Add a meeting to my calendar",
          ].map((prompt) => (
            <Button
              key={prompt}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setInput(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask your agent"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={isSending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
