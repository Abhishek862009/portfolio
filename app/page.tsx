import fs from 'node:fs';
import path from 'node:path';

import { Hero } from '@/components/sections/Hero';
import { Timeline } from '@/components/sections/Timeline';
import { Skills } from '@/components/sections/Skills';
import { ProjectsPreview } from '@/components/sections/ProjectsPreview';
import { AppStorePreview } from '@/components/sections/AppStorePreview';
import { MyStartups } from '@/components/sections/MyStartups';
import { BlogPreview } from '@/components/sections/BlogPreview';
import { Contact } from '@/components/sections/Contact';
import { getAllPosts } from '@/lib/blog';

// Navbar/main/Footer now live in app/layout.tsx so every route gets them —
// this page only supplies the homepage's section content. The Person
// structured data lives in app/layout.tsx too (one copy for the whole site).
export default function Home() {
  // Server-side check: the moment the real portrait lands at this exact
  // path, Hero switches from placeholder to photo automatically — no code
  // change needed when the asset is finally ready.
  const hasPhoto = fs.existsSync(
    path.join(process.cwd(), 'public', 'images', 'hero-photo.png')
  );

  // Latest three published posts for the Blog section (newest first). Only the fields the
  // section needs are passed on, not the full post text.
  const latestPosts = getAllPosts()
    .slice(0, 3)
    .map(({ slug, title, date, excerpt, tags }) => ({ slug, title, date, excerpt, tags }));

  return (
    <>
      <Hero hasPhoto={hasPhoto} />
      <Timeline />
      <Skills />
      <ProjectsPreview />
      <AppStorePreview />
      <MyStartups />
      <BlogPreview posts={latestPosts} />
      <Contact />
    </>
  );
}
