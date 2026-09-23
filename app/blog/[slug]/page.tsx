import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getAllPosts, getPostBySlug } from '@/lib/blog';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-frost"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <p className="mt-6 text-sm text-slate">
        {new Date(post.date).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <h1 className="mt-2 text-4xl font-semibold text-frost">{post.title}</h1>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-hairline px-3 py-1 text-xs text-slate"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-invert mt-10 max-w-none prose-headings:text-frost prose-p:text-slate prose-strong:text-frost prose-li:text-slate prose-a:text-glow">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
