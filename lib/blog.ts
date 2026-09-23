import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  author: string;
  coverImage: string;
  published: boolean;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    return {
      title: data.title ?? filename.replace(/\.mdx$/, ''),
      slug: data.slug ?? filename.replace(/\.mdx$/, ''),
      date: data.date ?? new Date().toISOString(),
      excerpt: data.excerpt ?? '',
      tags: data.tags ?? [],
      author: data.author ?? 'Abhishek',
      coverImage: data.coverImage ?? '',
      published: data.published ?? false,
      content,
    } satisfies BlogPost;
  });

  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
