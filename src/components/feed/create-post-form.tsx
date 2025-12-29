"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const postTypes = ["text", "link", "poll", "job", "collab", "question"] as const;

export function CreatePostForm() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [type, setType] = useState<(typeof postTypes)[number]>("text");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit() {
    setStatus("Posting...");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        type,
        linkUrl: linkUrl || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setStatus(data?.error || "Unable to post.");
      return;
    }

    setContent("");
    setLinkUrl("");
    setStatus("Posted.");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {postTypes.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={type === item ? "primary" : "outline"}
            onClick={() => setType(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share something real"
        maxLength={500}
      />
      {type === "link" || type === "job" ? (
        <Input
          value={linkUrl}
          onChange={(event) => setLinkUrl(event.target.value)}
          placeholder="Paste a link"
        />
      ) : null}
      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={!content.trim()}>
          Publish
        </Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
