import { notFound, redirect } from "next/navigation";
import { getMyProfile } from "@/services/profiles/queries";
import { getPostForEditing } from "@/services/posts/dashboard";
import { PostEditor } from "@/components/posts/post-editor";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "writer" && profile.role !== "admin") redirect("/dashboard/posts");

  const post = await getPostForEditing(params.id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <PostEditor
        mode="edit"
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          markdown: post.markdown,
          tags: post.tags,
          cover_image: post.cover_image,
          published: post.published
        }}
      />
    </div>
  );
}

