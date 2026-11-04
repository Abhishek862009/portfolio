import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { T } from '@/components/i18n/T';

export interface BlogPreviewPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

// Homepage teaser for /blog. Deliberately NOT a card grid like Projects, Bidevlink and the
// App Store: it reads like an editorial list (date on the left, headline and a short
// excerpt on the right, hairlines between the rows), so the four sections look different.
export function BlogPreview({ posts }: { posts: BlogPreviewPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-frost md:text-4xl">
            <T en="Blog" hi="ब्लॉग" />
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate">
            <T
              en="Learning journey, project breakdowns, and lessons from building things."
              hi="सीखने का सफ़र, प्रोजेक्ट्स की जानकारी, और कुछ बनाते हुए मिली सीख।"
            />
          </p>
        </div>
        <Link
          href="/blog"
          className="text-sm text-slate underline-offset-4 transition-colors hover:text-frost hover:underline"
        >
          <T en="All posts →" hi="सभी पोस्ट →" />
        </Link>
      </div>

      <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-2 py-7 md:grid-cols-[9rem_1fr_auto] md:gap-8"
            >
              <time dateTime={post.date} className="pt-1 text-sm text-slate/80">
                {new Date(post.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>

              <div className="min-w-0">
                <h3 className="text-lg font-medium text-frost transition-colors group-hover:text-glow md:text-xl">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">
                    {post.excerpt}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <p className="mt-3 text-xs text-slate/70">
                    {post.tags.slice(0, 3).map((tag) => `#${tag}`).join('  ')}
                  </p>
                )}
              </div>

              <ArrowUpRight
                aria-hidden="true"
                className="hidden h-5 w-5 self-start text-slate transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-glow md:block"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
