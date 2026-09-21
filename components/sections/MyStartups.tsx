import { startups } from '@/data/startups';
import { ViewProjectButton } from '@/components/ui/ViewProjectButton';

// Mirrors ProjectsPreview's card layout so the two sections read as one
// family, even though startups carry a tagline/description instead of a
// project's stack-first framing.
export function MyStartups() {
  return (
    <section id="bidevlink" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">Bidevlink</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {startups.map((startup) => (
          <div
            key={startup.slug}
            className="rounded-2xl border border-hairline bg-ink/40 p-6 transition-colors hover:border-glow/40"
          >
            <h3 className="text-lg font-medium text-frost">{startup.name}</h3>
            <p className="mt-1 text-sm text-slate/80 italic">{startup.tagline}</p>

            <p className="mt-3 text-sm text-slate">{startup.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {startup.stack.map((tech) => (
                <span key={tech} className="text-xs text-slate/70">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <ViewProjectButton href={startup.link} label="Visit Site" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
