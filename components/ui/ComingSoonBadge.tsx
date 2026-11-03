import { Clock } from 'lucide-react';

import { T } from '@/components/i18n/T';

/**
 * Stands in for the Open button on a web app that is not hosted yet. Same
 * size and shape as OpenAppButton so cards keep their rhythm, but muted and
 * not clickable.
 */
export function ComingSoonBadge({ size = 'default' }: { size?: 'default' | 'large' }) {
  const sizeClasses = size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-hairline font-medium text-slate ${sizeClasses}`}
    >
      <Clock className="h-4 w-4" aria-hidden="true" />
      <T en="Coming soon" hi="जल्द आ रहा है" />
    </span>
  );
}
