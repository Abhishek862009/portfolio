import { timeline } from '@/data/timeline';
import type { TimelineCategory } from '@/data/timeline';
import { T } from '@/components/i18n/T';

const CATEGORY_HI: Record<TimelineCategory, string> = {
  Education: 'शिक्षा',
  Achievement: 'उपलब्धि',
  Project: 'प्रोजेक्ट',
  Milestone: 'पड़ाव',
};

export function Timeline() {
  return (
    <section id="timeline" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">
        <T en="The story so far" hi="अब तक की कहानी" />
      </h2>
      <p className="mt-3 text-slate">
        <T
          en="Milestones, decisions, and the long-term vision — in order."
          hi="अहम पड़ाव, फ़ैसले और लंबे समय का सपना — क्रम से।"
        />
      </p>

      <ol className="mt-12 space-y-10 border-l border-hairline pl-8">
        {timeline.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[2.15rem] top-1.5 h-2.5 w-2.5 rounded-full bg-glow" />
            <h3 className="text-lg font-medium text-frost">
              <T en={entry.title} hi={entry.hi?.title} />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">
              <T en={entry.description} hi={entry.hi?.description} />
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-hairline px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-slate"
                >
                  <T en={cat} hi={CATEGORY_HI[cat]} />
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
