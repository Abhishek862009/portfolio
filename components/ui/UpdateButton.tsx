import type { ReactNode } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

import { T } from '@/components/i18n/T';
import { Magnetic } from './Magnetic';

interface UpdateButtonProps {
  href: string;
  label?: ReactNode;
  size?: 'default' | 'large';
}

/**
 * The "How to update" button for a Terminal app. It does not update anything by itself, it goes
 * to the update steps on the app's page (#update). Quieter than GuideButton (outline only) so the
 * main action, the setup guide, stays the first thing people see.
 */
export function UpdateButton({
  href,
  label = <T en="How to update" hi="अपडेट कैसे करें" />,
  size = 'default',
}: UpdateButtonProps) {
  const sizeClasses = size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <Magnetic strength={size === 'large' ? 6 : 4}>
      <Link
        href={href}
        className={`group inline-flex items-center gap-1.5 rounded-full border border-hairline font-medium text-frost transition-colors hover:border-glow/50 hover:bg-glow/10 ${sizeClasses}`}
      >
        {label}
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Magnetic>
  );
}
