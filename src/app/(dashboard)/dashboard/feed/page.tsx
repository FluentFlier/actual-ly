import { getFeedPosts } from "@/lib/data/feed";
import { CreatePostForm } from "@/components/feed/create-post-form";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function FeedPage() {
  const posts = await getFeedPosts();

  return (
    <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            posts.map((post) => {
              const author = post.users || {};
              return (
              <div key={post.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={author.avatar_url} alt={author.display_name || author.username} />
                  <div>
                    <p className="text-sm font-semibold">
                      {author.display_name || author.username || "Anonymous"}
                    </p>
                    <p className="text-xs text-muted-foreground">@{author.username || "unknown"}</p>
                  </div>
                  {author.is_verified ? <Badge variant="success">Verified</Badge> : null}
                </div>
                <p className="mt-3 text-sm">{post.content}</p>
              </div>
            );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
