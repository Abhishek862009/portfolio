import { ArrowUpRight } from 'lucide-react';
import { Magnetic } from './Magnetic';

interface OpenAppButtonProps {
  href: string;
  label?: string;
  size?: 'default' | 'large';
}

/**
 * Twin of DownloadButton for web apps: same look, but it opens the app
 * instead of downloading a file. A plain <a> on purpose: the app is a static
 * page outside the Next router, so it needs a full page load, not client
 * navigation.
 */
export function OpenAppButton({ href, label = 'Open app', size = 'default' }: OpenAppButtonProps) {
  const sizeClasses = size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <Magnetic strength={size === 'large' ? 6 : 4}>
      <a
        href={href}
        className={`group inline-flex items-center gap-1.5 rounded-full border border-glow/40 bg-glow/10 font-medium text-frost transition-colors hover:border-glow/60 hover:bg-glow/20 ${sizeClasses}`}
      >
        {label}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </Magnetic>
  );
}
