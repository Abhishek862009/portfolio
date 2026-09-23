import type { Metadata } from 'next';
import Link from 'next/link';

import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Learning journey, project breakdowns, technology experiments, and lessons from building things.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="text-4xl font-semibold text-frost">Blog</h1>
        <p className="mt-4 text-slate">
          Coming soon — learning journey, project breakdowns, technology experiments, and lessons
          from building things.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-32">
      <h1 className="text-4xl font-semibold text-frost">Blog</h1>

      <div className="mt-12 flex flex-col gap-10">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <p className="text-sm text-slate">
              {new Date(post.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-frost transition-colors group-hover:text-glow">
              {post.title}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-slate">{post.excerpt}</p>
            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
