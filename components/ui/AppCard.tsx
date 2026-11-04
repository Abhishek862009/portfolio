import Link from 'next/link';

import type { AppEntry } from '@/data/apps';
import { STORE_PATH } from '@/data/apps';
import { T } from '@/components/i18n/T';
import { AppIcon } from '@/components/ui/AppIcon';
import { ComingSoonBadge } from '@/components/ui/ComingSoonBadge';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { GuideButton } from '@/components/ui/GuideButton';
import { OpenAppButton } from '@/components/ui/OpenAppButton';

// Small labels under the description, with their Hindi versions.
const META_HI: Record<string, string> = {
  'Web app': 'वेब ऐप',
  'Terminal app': 'टर्मिनल ऐप',
};

// The platform is shown as its own badge in the corner, so it is not repeated here.
function metaFor(app: AppEntry): string[] {
  const devices = app.platform === 'Terminal' ? ['Windows · Android · Linux · Mac'] : [];
  return [app.fileType, ...devices, app.sizeLabel, app.version && `v${app.version}`].filter(
    Boolean
  ) as string[];
}

// Design: an "app store tile" — a big glowing app icon, a platform badge in the corner,
// small grey chips for file type / size / version, and a footer strip that holds the
// action button. Different from the Projects window boxes and the Bidevlink banner,
// but the same colours, so it still belongs to the site. Used by both the homepage
// section and the /apps page.
export function AppCard({ app }: { app: AppEntry }) {
  const meta = metaFor(app);
  const details = `${STORE_PATH}/${app.slug}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-ink/80 to-ink/30 transition-colors hover:border-glow/40">
      <div className="flex-1 p-6">
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.35rem] border border-glow/30 bg-glow/10 text-glow shadow-[0_0_28px_-8px] shadow-glow transition-transform group-hover:scale-105"
          >
            <AppIcon icon={app.icon} className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <Link href={details} className="group/title min-w-0">
                <h3 className="text-lg font-semibold text-frost transition-colors group-hover/title:text-glow">
                  {app.name}
                </h3>
              </Link>
              <span className="shrink-0 rounded-full border border-hairline bg-void/60 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-slate">
                {app.platform}
              </span>
            </div>
            <p className="mt-1 text-sm italic text-slate/80">
              <T en={app.tagline} hi={app.hi?.tagline} />
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate">
          <T en={app.description} hi={app.hi?.description} />
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {meta.map((item) => (
            <span
              key={item}
              className="rounded-md bg-void/70 px-2 py-0.5 text-[11px] text-slate"
            >
              <T en={item} hi={META_HI[item]} />
            </span>
          ))}
        </div>
      </div>

      {/* Footer strip with the action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline bg-void/40 px-6 py-4">
        {app.platform === 'Android' ? (
          <DownloadButton href={app.downloadUrl} />
        ) : app.platform === 'Terminal' ? (
          <GuideButton href={`${details}#setup`} />
        ) : app.comingSoon ? (
          <ComingSoonBadge />
        ) : (
          <OpenAppButton href={app.openUrl} external={app.external} />
        )}
        {app.platform !== 'Terminal' && (
          <Link
            href={details}
            className="text-xs text-slate underline-offset-4 transition-colors hover:text-frost hover:underline"
          >
            <T en="App details →" hi="ऐप की जानकारी →" />
          </Link>
        )}
      </div>
    </div>
  );
}
