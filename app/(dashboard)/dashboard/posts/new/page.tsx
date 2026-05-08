import { redirect } from "next/navigation";
import { getMyProfile } from "@/services/profiles/queries";
import { PostEditor } from "@/components/posts/post-editor";

export default async function NewPostPage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "writer" && profile.role !== "admin") redirect("/dashboard/posts");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New post</h1>
      <PostEditor mode="create" />
    </div>
  );
}

