import type { MetadataRoute } from "next";
import { getPublishedPostSlugs } from "@/services/posts/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const slugs = await getPublishedPostSlugs();
  const now = new Date();

  return [
    {
      url: `${appUrl}/`,
      lastModified: now
    },
    {
      url: `${appUrl}/blog`,
      lastModified: now
    },
    ...slugs.map((slug) => ({
      url: `${appUrl}/blog/${slug}`,
      lastModified: now
    }))
  ];
}

