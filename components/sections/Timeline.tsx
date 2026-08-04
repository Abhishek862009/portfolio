import { timeline } from '@/data/timeline';

// Functional baseline — filterable tag interaction and scroll choreography
// land in a later phase. Structure here already supports it: each entry
// carries its categories, ready to wire up filtering.
export function Timeline() {
  return (
    <section id="timeline" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">The story so far</h2>
      <p className="mt-3 text-slate">Milestones, decisions, and the long-term vision — in order.</p>

      <ol className="mt-12 space-y-10 border-l border-hairline pl-8">
        {timeline.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[2.15rem] top-1.5 h-2.5 w-2.5 rounded-full bg-glow" />
            <h3 className="text-lg font-medium text-frost">{entry.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{entry.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-hairline px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-slate"
                >
                  {cat}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
