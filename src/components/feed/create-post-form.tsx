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
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [status, setStatus] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) return;
    setIsPosting(true);
    setStatus("Posting...");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          type,
          linkUrl: linkUrl || undefined,
          pollOptions:
            type === "poll"
              ? pollOptions.map((option) => option.trim()).filter(Boolean)
              : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus(data?.error || "Unable to post.");
        return;
      }

      setContent("");
      setLinkUrl("");
      setPollOptions(["", ""]);
      setStatus("Posted.");
      router.refresh();
    } catch {
      setStatus("Post failed. Check your connection and try again.");
    } finally {
      setIsPosting(false);
    }
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
      {type === "poll" ? (
        <div className="space-y-2">
          {pollOptions.map((option, index) => (
            <Input
              key={`poll-${index}`}
              value={option}
              onChange={(event) => {
                const next = [...pollOptions];
                next[index] = event.target.value;
                setPollOptions(next);
              }}
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPollOptions((prev) => [...prev, ""])}
          >
            Add option
          </Button>
        </div>
      ) : null}
      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={!content.trim() || isPosting}>
          {isPosting ? "Posting..." : "Publish"}
        </Button>
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
