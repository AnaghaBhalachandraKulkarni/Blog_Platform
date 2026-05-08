import Link from "next/link";
import { requireAdmin } from "@/services/auth/guards";
import { getAllPostsForAdmin } from "@/services/posts/admin";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await getAllPostsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Posts</h1>
        <p className="text-sm text-muted-foreground">Admin view of all posts.</p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">No posts.</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Published</th>
                    <th className="p-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} className="border-b last:border-b-0">
                      <td className="p-3">
                        <Link href={`/dashboard/posts/${p.id}/edit`} className="font-medium hover:underline underline-offset-4">
                          {p.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">{p.slug}</div>
                      </td>
                      <td className="p-3">{p.published ? "yes" : "no"}</td>
                      <td className="p-3 text-muted-foreground">{new Date(p.updated_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

