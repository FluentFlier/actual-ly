"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Collection = {
  id: string;
  name: string;
  icon?: string | null;
  is_default?: boolean | null;
};

export default function CollectionsPage() {
  const { user, isLoaded } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  async function handleCreate() {
    if (!name.trim() || isSaving) return;
    setIsSaving(true);
    setStatus("Saving...");
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify({
        name: name.trim(),
        icon: icon.trim() || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data?.error || "Unable to create collection.");
      setIsSaving(false);
      return;
    }
    setCollections((prev) => [data.collection, ...prev]);
    setName("");
    setIcon("");
    setStatus("Saved.");
    setIsSaving(false);
  }

  async function handleRename(collection: Collection) {
    const nextName = window.prompt("Rename collection", collection.name);
    if (!nextName || !nextName.trim()) return;
    const res = await fetch(`/api/collections/${collection.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
      body: JSON.stringify({ name: nextName.trim() }),
    });
    if (!res.ok) {
      setStatus("Unable to rename.");
      return;
    }
    setCollections((prev) =>
      prev.map((item) => (item.id === collection.id ? { ...item, name: nextName.trim() } : item)),
    );
  }

  async function handleDelete(collection: Collection) {
    if (collection.is_default) return;
    if (!window.confirm("Delete this collection?")) return;
    const res = await fetch(`/api/collections/${collection.id}`, {
      method: "DELETE",
      headers: {
        ...(user?.id ? { "x-clerk-user-id": user.id } : {}),
      },
    });
    if (!res.ok) {
      setStatus("Unable to delete.");
      return;
    }
    setCollections((prev) => prev.filter((item) => item.id !== collection.id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {collections.length === 0 ? (
            <p className="text-sm text-muted-foreground">No collections yet.</p>
          ) : (
            collections.map((collection) => (
              <div
                key={collection.id}
                className="flex items-center justify-between rounded-2xl border border-border/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {collection.icon ? `${collection.icon} ` : ""}
                    {collection.name}
                  </p>
                  {collection.is_default ? (
                    <p className="text-xs text-muted-foreground">Default collection</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRename(collection)}>
                    Rename
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={collection.is_default ?? false}
                    onClick={() => handleDelete(collection)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            placeholder="Icon (emoji)"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate} disabled={isSaving}>
              {isSaving ? "Saving" : "Create"}
            </Button>
            {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
