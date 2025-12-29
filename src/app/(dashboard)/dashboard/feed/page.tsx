import { auth } from "@clerk/nextjs/server";
import { getFeedPosts } from "@/lib/data/feed";
import { CreatePostForm } from "@/components/feed/create-post-form";
import { PostCard } from "@/components/feed/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default async function FeedPage() {
  const { userId } = await auth();
  const posts = await getFeedPosts(userId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Share a Post</CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePostForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verified Only Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">No posts yet.</p>
                <p className="text-xs text-muted-foreground">Be the first verified human to post.</p>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle>Feed Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <p>Every post is tied to a verified human. No bots, no spam.</p>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs">
              <Sparkles className="h-4 w-4" />
              AI summaries will auto-populate soon.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suggested Topics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[
              "#founders",
              "#jobs",
              "#product",
              "#ai",
              "#design",
              "#collab",
            ].map((tag) => (
              <Button key={tag} variant="outline" size="sm">
                {tag}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
