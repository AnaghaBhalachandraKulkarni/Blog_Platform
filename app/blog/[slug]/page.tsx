import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/services/posts/public";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { CommentsSection } from "@/components/comments/comments-section";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const canonical = `${appUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: canonical,
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPublishedPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <div className="container py-16 space-y-10">
      <article className="space-y-4">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="text-sm text-muted-foreground">
            {post.reading_time} min read • {new Date(post.created_at).toLocaleDateString()}
          </div>
        </header>
        <MarkdownRenderer markdown={post.markdown} />
      </article>

      <CommentsSection postId={post.id} />
    </div>
  );
}

