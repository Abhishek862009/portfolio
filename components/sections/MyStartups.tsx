import { startups } from '@/data/startups';
import { T } from '@/components/i18n/T';
import { ViewProjectButton } from '@/components/ui/ViewProjectButton';

// Design: Bidevlink is a business, not a demo, so it gets a full-width "feature banner" on
// its own tinted band — one big card with a soft blue glow, larger type and the button on
// the right — instead of the small boxes used by Projects and the App Store.
export function MyStartups() {
  return (
    <section
      id="bidevlink"
      className="scroll-mt-24 border-y border-hairline bg-gradient-to-b from-ink/70 to-void"
    >
      <div className="mx-auto max-w-5xl px-6 py-32">
        <h2 className="text-3xl font-semibold text-frost md:text-4xl">Bidevlink</h2>

        <div className="mt-10 space-y-6">
          {startups.map((startup) => (
            <div
              key={startup.slug}
              className="relative overflow-hidden rounded-3xl border border-glow/20 bg-ink/60 p-8 md:p-10"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-glow/10 blur-3xl"
              />

              <div className="relative gap-10 md:flex md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-medium uppercase tracking-widest text-glow">
                    <T en="Founded by Abhishek" hi="Abhishek द्वारा शुरू किया गया" />
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-frost md:text-3xl">
                    {startup.name}
                  </h3>
                  <p className="mt-2 text-base text-frost/80">
                    <T en={startup.tagline} hi={startup.hi?.tagline} />
                  </p>

                  <p className="mt-5 text-sm leading-relaxed text-slate">
                    <T en={startup.description} hi={startup.hi?.description} />
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {startup.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-hairline px-3 py-1 text-xs text-slate"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 shrink-0 md:mt-0">
                  <ViewProjectButton href={startup.link} label="Visit Site" size="large" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
