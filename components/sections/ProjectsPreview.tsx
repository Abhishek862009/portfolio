import Link from 'next/link';
import { projects } from '@/data/projects';
import { ViewProjectButton } from '@/components/ui/ViewProjectButton';

// Rebuilt per explicit rebuild instructions: real "View Project" buttons
// (opening in a new tab) instead of showing raw CodePen URLs, correct
// not-live handling for Word Meaning Game, and Love Letter's three
// versions inside one card. The title still links through to the detail
// page (where the disclaimers live) — kept as a small secondary link so
// the big button stays the primary action, per spec.
export function ProjectsPreview() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">Projects</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="rounded-2xl border border-hairline bg-ink/40 p-6 transition-colors hover:border-glow/40"
          >
            <div className="flex items-start justify-between gap-3">
              <Link href={`/projects/${project.slug}`} className="group">
                <h3 className="text-lg font-medium text-frost transition-colors group-hover:text-glow">
                  {project.title}
                </h3>
              </Link>
              {project.status === 'not-live' && (
                <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate">
                  Not live
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-slate">{project.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="text-xs text-slate/70">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5">
              {project.status === 'not-live' ? (
                <p className="text-sm italic text-slate/80">
                  This project is currently not available online.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.links.map((link) => (
                    <ViewProjectButton key={link.url} href={link.url} label={link.label} />
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/projects/${project.slug}`}
              className="mt-4 inline-block text-xs text-slate underline-offset-4 transition-colors hover:text-frost hover:underline"
            >
              Project details →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
