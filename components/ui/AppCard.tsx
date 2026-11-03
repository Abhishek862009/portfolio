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

function metaFor(app: AppEntry): string[] {
  const type = app.platform === 'Android' ? [app.platform, app.fileType] : [app.fileType];
  const devices = app.platform === 'Terminal' ? ['Windows · Android · Linux · Mac'] : [];
  return [...type, ...devices, app.sizeLabel, app.version && `v${app.version}`].filter(Boolean) as string[];
}

// Same card family as ProjectsPreview / MyStartups: rounded-2xl, hairline
// border, ink/40 surface, glow border on hover.
export function AppCard({ app }: { app: AppEntry }) {
  const meta = metaFor(app);
  const details = `${STORE_PATH}/${app.slug}`;

  return (
    <div className="rounded-2xl border border-hairline bg-ink/40 p-6 transition-colors hover:border-glow/40">
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hairline bg-void text-glow"
        >
          <AppIcon icon={app.icon} className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <Link href={details} className="group">
            <h3 className="text-lg font-medium text-frost transition-colors group-hover:text-glow">
              {app.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm italic text-slate/80">
            <T en={app.tagline} hi={app.hi?.tagline} />
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate">
        <T en={app.description} hi={app.hi?.description} />
      </p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {meta.map((item) => (
          <span key={item} className="text-xs text-slate/70">
            <T en={item} hi={META_HI[item]} />
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
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
