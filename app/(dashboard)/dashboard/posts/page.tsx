import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyProfile } from "@/services/profiles/queries";
import { getMyPosts } from "@/services/posts/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPostsPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");

  const canWrite = profile.role === "writer" || profile.role === "admin";
  const posts = canWrite ? await getMyPosts() : [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-muted-foreground">Create and manage your posts.</p>
        </div>
        <Button asChild disabled={!canWrite}>
          <Link href="/dashboard/posts/new">New post</Link>
        </Button>
      </div>

      {!canWrite ? (
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">
            Your role is <span className="font-medium text-foreground">{profile.role}</span>. Ask an
            admin to grant writer access.
          </CardContent>
        </Card>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No posts yet. Create your first post.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((p) => (
            <Card key={p.id}>
              <CardHeader className="py-4">
                <CardTitle className="text-base">
                  <Link href={`/dashboard/posts/${p.id}/edit`} className="hover:underline underline-offset-4">
                    {p.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4 pt-0">
                {p.excerpt ? <p className="text-sm text-muted-foreground">{p.excerpt}</p> : null}
                <div className="text-xs text-muted-foreground">
                  {p.reading_time} min read • {new Date(p.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

