import { skills, type SkillCategory } from '@/data/skills';
import { T } from '@/components/i18n/T';

const CATEGORY_HI: Record<SkillCategory, string> = {
  'Core Skills': 'मुख्य स्किल्स',
  'Tools & Technologies': 'टूल्स और टेक्नोलॉजी',
  'Currently Exploring': 'अभी सीख रहा हूँ',
};

const CATEGORIES: SkillCategory[] = ['Core Skills', 'Tools & Technologies', 'Currently Exploring'];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-32">
      <h2 className="text-3xl font-semibold text-frost md:text-4xl">
        <T en="Skills" hi="स्किल्स" />
      </h2>
      <div className="mt-10 space-y-10">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-medium uppercase tracking-widest text-slate">
              <T en={category} hi={CATEGORY_HI[category]} />
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
