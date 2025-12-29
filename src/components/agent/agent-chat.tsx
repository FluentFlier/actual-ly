"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    const res = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input.trim() }),
    });

    if (!res.ok) {
      setIsSending(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I hit a snag. Try again." },
      ]);
      return;
    }

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    setIsSending(false);
  }

  return (
    <div className="space-y-4">
      <Card className="flex min-h-[360px] flex-col gap-4 p-4">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {messages.length === 0 ? (
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
  useEffect(() => {
    fetch("/api/agent/conversation")
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
      .catch(() => null);
  }, []);
