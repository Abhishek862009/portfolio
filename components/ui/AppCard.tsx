import Link from 'next/link';
import { Images } from 'lucide-react';

import type { AppEntry } from '@/data/apps';
import { STORE_PATH } from '@/data/apps';
import { DownloadButton } from '@/components/ui/DownloadButton';

// Same card family as ProjectsPreview / MyStartups: rounded-2xl, hairline
// border, ink/40 surface, glow border on hover.
export function AppCard({ app }: { app: AppEntry }) {
  const meta = [app.platform, app.fileType, app.sizeLabel, app.version && `v${app.version}`].filter(
    Boolean
  ) as string[];

  return (
    <div className="rounded-2xl border border-hairline bg-ink/40 p-6 transition-colors hover:border-glow/40">
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-hairline bg-void text-glow"
        >
          <Images className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <Link href={`${STORE_PATH}/${app.slug}`} className="group">
            <h3 className="text-lg font-medium text-frost transition-colors group-hover:text-glow">
              {app.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm italic text-slate/80">{app.tagline}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate">{app.description}</p>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {meta.map((item) => (
          <span key={item} className="text-xs text-slate/70">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <DownloadButton href={app.downloadUrl} />
        <Link
          href={`${STORE_PATH}/${app.slug}`}
          className="text-xs text-slate underline-offset-4 transition-colors hover:text-frost hover:underline"
        >
          App details →
        </Link>
      </div>
    </div>
  );
}
