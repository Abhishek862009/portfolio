import type { ReactNode } from 'react';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

import { T } from '@/components/i18n/T';
import { Magnetic } from './Magnetic';

interface GuideButtonProps {
  href: string;
  label?: ReactNode;
  size?: 'default' | 'large';
}

/**
 * The button for a Terminal app: it does not install anything by itself, it goes
 * to the page with the device picker and the step-by-step setup guide. Same look
 * as DownloadButton / OpenAppButton so the store cards stay one family.
 */
export function GuideButton({
  href,
  label = <T en="Setup guide" hi="सेटअप गाइड" />,
  size = 'default',
}: GuideButtonProps) {
  const sizeClasses = size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <Magnetic strength={size === 'large' ? 6 : 4}>
      <Link
        href={href}
        className={`group inline-flex items-center gap-1.5 rounded-full border border-glow/40 bg-glow/10 font-medium text-frost transition-colors hover:border-glow/60 hover:bg-glow/20 ${sizeClasses}`}
      >
        {label}
        <Terminal className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Magnetic>
  );
}
