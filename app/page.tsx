import fs from 'node:fs';
import path from 'node:path';
import { Hero } from '@/components/sections/Hero';
import { Timeline } from '@/components/sections/Timeline';
import { Skills } from '@/components/sections/Skills';
import { ProjectsPreview } from '@/components/sections/ProjectsPreview';
import { Contact } from '@/components/sections/Contact';

// Navbar/main/Footer now live in app/layout.tsx so every route gets them —
// this page only supplies the homepage's section content.
export default function Home() {
  // Server-side check: the moment the real portrait lands at this exact
  // path, Hero switches from placeholder to photo automatically — no code
  // change needed when the asset is finally ready.
  const hasPhoto = fs.existsSync(
    path.join(process.cwd(), 'public', 'images', 'hero-photo.png')
  );

  return (
    <>
      <Hero hasPhoto={hasPhoto} />
      <Timeline />
      <Skills />
      <ProjectsPreview />
      <Contact />
    </>
  );
}
