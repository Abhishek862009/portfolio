import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { projects, GLOBAL_PROJECT_DISCLAIMER } from '@/data/projects';
import { ViewProjectButton } from '@/components/ui/ViewProjectButton';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <Link
        href="/#projects"
        className="inline-flex items-center gap-2 text-sm text-slate transition-colors hover:text-frost"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <h1 className="mt-6 text-4xl font-semibold text-frost">{project.title}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-hairline px-3 py-1 text-xs text-slate"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-slate">
        {project.description}
      </p>

      {/* Project-specific disclaimer — e.g. the humor context on the dowry
          calculator. Separate from, and in addition to, the sitewide one
          below. */}
      {project.disclaimer && (
        <div className="mt-6 max-w-xl rounded-xl border border-hairline bg-ink/40 p-4 text-sm italic text-slate">
          {project.disclaimer}
        </div>
      )}

      {/* CTA area */}
      <div className="mt-8">
        {project.status === 'not-live' ? (
          <p className="inline-block rounded-full border border-hairline px-5 py-2.5 text-sm text-slate">
            This project is currently not available online.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {project.links.map((link) => (
              <ViewProjectButton key={link.url} href={link.url} label={link.label} size="large" />
            ))}
          </div>
        )}
      </div>

      {/* Sitewide disclaimer — shown on every project detail page */}
      <div className="mt-16 border-t border-hairline pt-6">
        <p className="text-xs italic text-slate/80">{GLOBAL_PROJECT_DISCLAIMER}</p>
      </div>
    </div>
  );
}
