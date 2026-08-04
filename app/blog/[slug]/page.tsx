import { notFound } from 'next/navigation';

// TODO (future phase): read posts from content/blog/*.mdx via gray-matter +
// next-mdx-remote, once real content exists. No posts yet by design — see
// blueprint Section 5 (Blog): no filler content just to fill the section.
export default function BlogPostPage() {
  notFound();
}
