import Link from 'next/link';
import { T } from '@/components/i18n/T';
import { projects } from '@/data/projects';
import { ViewProjectButton } from '@/components/ui/ViewProjectButton';

// Design: each project is a small "window" — a title bar with three dots and the project's
// name-in-the-URL, then the content underneath. That is what makes Projects look different
// from the Bidevlink banner and the App Store tiles. Behaviour is unchanged: real "View
// Project" buttons (new tab), the not-live handling for Word Meaning Game, and Love
// Letter's three versions inside one card. The title still links through to the detail page
// (where the disclaimers live).
export function ProjectsPreview() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">
        <T en="Projects" hi="प्रोजेक्ट्स" />
      </h2>
      <p className="mt-3 max-w-xl text-sm text-slate">
        <T
          en="Small things I built to learn — open any of them and try it."
          hi="सीखने के लिए बनाई छोटी-छोटी चीज़ें — कोई भी खोलकर आज़माएँ।"
        />
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-ink/40 transition-colors hover:border-glow/40"
          >
            {/* Window title bar */}
            <div className="flex items-center gap-1.5 border-b border-hairline bg-void/60 px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-slate/30 transition-colors group-hover:bg-glow" />
              <span className="h-2 w-2 rounded-full bg-slate/30" />
              <span className="h-2 w-2 rounded-full bg-slate/30" />
              <span className="ml-3 min-w-0 flex-1 truncate font-mono text-[11px] text-slate/70">
                /{project.slug}
              </span>
              {project.status === 'not-live' && (
                <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate">
                  <T en="Not live" hi="लाइव नहीं" />
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <Link href={`/projects/${project.slug}`} className="group/title w-fit">
                <h3 className="text-lg font-medium text-frost transition-colors group-hover/title:text-glow">
                  {project.title}
                </h3>
              </Link>

              <p className="mt-2 text-sm text-slate">
                <T en={project.description} hi={project.descriptionHi} />
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-hairline bg-void/60 px-2 py-0.5 font-mono text-[11px] text-slate"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                {project.status === 'not-live' ? (
                  <p className="text-sm italic text-slate/80">
                    <T
                      en="This project is currently not available online."
                      hi="यह प्रोजेक्ट अभी ऑनलाइन उपलब्ध नहीं है।"
                    />
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
                <T en="Project details →" hi="प्रोजेक्ट की जानकारी →" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
