export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  reading_time: number;
  created_at: string;
};

export type PostDetail = PostListItem & {
  markdown: string;
  updated_at: string;
  author: string;
  published: boolean;
};

