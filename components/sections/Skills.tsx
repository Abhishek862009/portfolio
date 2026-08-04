import { skills, type SkillCategory } from '@/data/skills';

const CATEGORIES: SkillCategory[] = ['Core Skills', 'Tools & Technologies', 'Currently Exploring'];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">Skills</h2>
      <div className="mt-10 space-y-10">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-medium uppercase tracking-widest text-slate">
              {category}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === category)
                .map((s) => (
                  <span
                    key={s.name}
                    className={
                      category === 'Currently Exploring'
                        ? 'rounded-full border border-dashed border-hairline px-3 py-1 text-sm text-slate'
                        : 'rounded-full border border-hairline bg-ink px-3 py-1 text-sm text-frost'
                    }
                  >
                    {s.name}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
