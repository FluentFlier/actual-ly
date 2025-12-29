"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Collection = {
  id: string;
  name: string;
  icon?: string | null;
  is_default?: boolean | null;
};

type SavedItem = {
  id: string;
  url: string;
  title?: string | null;
  ai_summary?: string | null;
  created_at: string;
  collections?: { name?: string | null; icon?: string | null } | null;
};

export default function SavedPage() {
  const { user, isLoaded } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/collections", {
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => setCollections(data?.collections ?? []))
      .catch(() => setCollections([]));
  }, [isLoaded, user?.id]);

  useEffect(() => {
    if (!isLoaded) return;
    const url = selectedCollection
      ? `/api/saved?collectionId=${selectedCollection}`
      : "/api/saved";
    fetch(url, {
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => setItems(data?.items ?? []))
      .catch(() => setItems([]));
  }, [isLoaded, selectedCollection, user?.id]);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Collections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={!selectedCollection ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setSelectedCollection(null)}
          >
            All saved
          </Button>
          {collections.map((collection) => (
            <Button
              key={collection.id}
              variant={selectedCollection === collection.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedCollection(collection.id)}
            >
              {collection.icon ? `${collection.icon} ` : ""}
              {collection.name}
            </Button>
          ))}
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/collections">Manage collections</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved items yet.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.title || item.url}</p>
                    <p className="text-xs text-muted-foreground">{item.url}</p>
                  </div>
                  {item.collections ? (
                    <Badge variant="outline">
                      {item.collections.icon ? `${item.collections.icon} ` : ""}
                      {item.collections.name}
                    </Badge>
                  ) : null}
                </div>
                {item.ai_summary ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    AI summary: {item.ai_summary}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
