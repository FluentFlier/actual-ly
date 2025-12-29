"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Post = {
  id: string;
  content: string;
  type: string;
  link_url?: string | null;
  link_preview?: {
    title?: string | null;
    description?: string | null;
    image?: string | null;
    url?: string | null;
  } | null;
  ai_summary?: string | null;
  poll_options?: Array<{ option: string; votes?: number }> | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  liked?: boolean;
  users?:
    | {
        id?: string;
        username?: string | null;
        display_name?: string | null;
        avatar_url?: string | null;
        is_verified?: boolean | null;
      }
    | Array<{
        id?: string;
        username?: string | null;
        display_name?: string | null;
        avatar_url?: string | null;
        is_verified?: boolean | null;
      }>
    | null;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user: { username?: string | null; display_name?: string | null } | null;
};

export function PostCard({ post }: { post: Post }) {
  const { user } = useUser();
  const author = Array.isArray(post.users) ? post.users[0] || {} : post.users || {};
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState(post.poll_options ?? []);
  const [isSaving, setIsSaving] = useState(false);

  async function toggleLike() {
    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: "POST",
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    setLiked(Boolean(data?.liked));
    setLikes(data?.likes_count ?? likes + (liked ? -1 : 1));
  }

  async function loadComments() {
    const res = await fetch(`/api/posts/${post.id}/comments`);
    if (!res.ok) return;
    const data = await res.json();
    setComments(data?.comments ?? []);
  }

  async function handleCommentSubmit() {
    if (!commentInput.trim()) return;
    setStatus("Sending...");
    const res = await fetch(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify({ content: commentInput.trim() }),
    });
    if (!res.ok) {
      setStatus("Unable to comment.");
      return;
    }
    setCommentInput("");
    setStatus(null);
    await loadComments();
  }

  async function handleVote(index: number) {
    const res = await fetch(`/api/posts/${post.id}/poll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify({ index }),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data?.poll_options)) {
      setPollOptions(data.poll_options);
    }
  }

  async function handleSave() {
    if (!post.link_url || isSaving) return;
    setIsSaving(true);
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify({
        url: post.link_url,
        title: post.link_preview?.title || post.link_url,
      }),
    });
    if (!res.ok) {
      setStatus("Unable to save.");
    } else {
      setStatus("Saved.");
    }
    setIsSaving(false);
  }

  return (
    <div className="rounded-2xl border border-border/70 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar
          src={author.avatar_url ?? undefined}
          alt={author.display_name || author.username || "User"}
        />
        <div>
          <p className="text-sm font-semibold">
            {author.display_name || author.username || "Anonymous"}
          </p>
          <p className="text-xs text-muted-foreground">@{author.username || "unknown"}</p>
        </div>
        {author.is_verified ? <Badge variant="success">Verified</Badge> : null}
      </div>
      <p className="mt-3 text-sm">{post.content}</p>
      {post.link_url ? (
        <a
          href={post.link_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block rounded-xl border border-border bg-muted/50 p-3 text-xs"
        >
          <p className="text-sm font-semibold">
            {post.link_preview?.title || post.link_url}
          </p>
          {post.link_preview?.description ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {post.link_preview.description}
            </p>
          ) : null}
        </a>
      ) : null}
      {post.ai_summary ? (
        <p className="mt-2 text-xs text-muted-foreground">AI summary: {post.ai_summary}</p>
      ) : null}
      {post.type === "poll" && pollOptions.length > 0 ? (
        <div className="mt-4 space-y-2">
          {pollOptions.map((option, index) => (
            <Button
              key={`${post.id}-poll-${index}`}
              variant="outline"
              size="sm"
              onClick={() => handleVote(index)}
            >
              {option.option} ({option.votes ?? 0})
            </Button>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <Button variant={liked ? "secondary" : "outline"} size="sm" onClick={toggleLike}>
          <Heart className="mr-2 h-4 w-4" /> {likes}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            const nextOpen = !commentsOpen;
            setCommentsOpen(nextOpen);
            if (nextOpen && comments.length === 0) {
              await loadComments();
            }
          }}
        >
          <MessageCircle className="mr-2 h-4 w-4" /> {post.comments_count}
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
        {post.link_url ? (
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
            <Bookmark className="mr-2 h-4 w-4" /> {isSaving ? "Saving" : "Save"}
          </Button>
        ) : null}
        {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
      </div>
      {commentsOpen ? (
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            {comments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-border/70 p-3 text-xs">
                  <p className="font-semibold">
                    {comment.user?.display_name || comment.user?.username || "User"}
                  </p>
                  <p className="text-muted-foreground">{comment.content}</p>
                </div>
              ))
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              value={commentInput}
              onChange={(event) => setCommentInput(event.target.value)}
              placeholder="Write a comment"
            />
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={handleCommentSubmit}>
                Comment
              </Button>
              {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
