import { getServerSession } from "@/services/auth/session";
import { getCommentsForPost } from "@/services/comments/queries";
import { CommentForm } from "@/components/comments/comment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function CommentsSection({ postId }: { postId: string }) {
  const user = await getServerSession();
  const comments = await getCommentsForPost(postId);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-semibold">Comments</h2>
        <div className="text-sm text-muted-foreground">{comments.length} total</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a comment</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentForm postId={postId} isAuthenticated={Boolean(user)} />
        </CardContent>
      </Card>

      {comments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No comments yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <Card key={c.id}>
              <CardHeader className="py-4">
                <CardTitle className="text-sm">
                  {c.author_display_name ?? "User"}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    • {new Date(c.created_at).toLocaleString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 pt-0 text-sm">{c.body}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

