import { ArrowUpRight } from 'lucide-react';

import { T } from '@/components/i18n/T';
import { Magnetic } from './Magnetic';

// Button texts come from the data files as plain English strings; these are their Hindi versions.
function hindiLabel(label: string): string | undefined {
  if (label === 'View Project') return 'प्रोजेक्ट देखें';
  if (label === 'Visit Site') return 'साइट खोलें';
  const version = /^View Version (\d+)$/.exec(label);
  return version ? `वर्शन ${version[1]} देखें` : undefined;
}

interface ViewProjectButtonProps {
  href: string;
  label?: string;
  size?: 'default' | 'large';
}

/**
 * The CTA used everywhere a project links to its live demo — grid cards
 * and detail pages both use this, so they can't drift out of sync.
 * Always opens in a new tab; a visitor clicking through to an external
 * CodePen should never lose their place on the portfolio.
 */
export function ViewProjectButton({
  href,
  label = 'View Project',
  size = 'default',
}: ViewProjectButtonProps) {
  const sizeClasses = size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <Magnetic strength={size === 'large' ? 6 : 4}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-1.5 rounded-full border border-glow/40 bg-glow/10 font-medium text-frost transition-colors hover:border-glow/60 hover:bg-glow/20 ${sizeClasses}`}
      >
        <T en={label} hi={hindiLabel(label)} />
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </Magnetic>
  );
}
