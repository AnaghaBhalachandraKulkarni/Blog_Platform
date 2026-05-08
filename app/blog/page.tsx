import Link from "next/link";
import { getPublishedPosts } from "@/services/posts/public";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="container py-16 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground">Latest published posts.</p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No posts yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle className="text-xl">
                  <Link href={`/blog/${post.slug}`} className="hover:underline underline-offset-4">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {post.excerpt ? <p className="text-sm text-muted-foreground">{post.excerpt}</p> : null}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{post.reading_time} min read</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  {post.tags.length ? (
                    <>
                      <span>•</span>
                      <span>{post.tags.join(", ")}</span>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

