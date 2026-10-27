import { Download } from 'lucide-react';
import { Magnetic } from './Magnetic';

interface DownloadButtonProps {
  href: string;
  label?: string;
  size?: 'default' | 'large';
}

/**
 * Same look as ViewProjectButton so the App Store reads as part of the
 * site, but it is a download, not an external visit — so no new tab (the
 * GitHub Release URL answers with the file itself) and a download icon.
 */
export function DownloadButton({
  href,
  label = 'Download APK',
  size = 'default',
}: DownloadButtonProps) {
  const sizeClasses = size === 'large' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <Magnetic strength={size === 'large' ? 6 : 4}>
      <a
        href={href}
        download
        className={`group inline-flex items-center gap-1.5 rounded-full border border-glow/40 bg-glow/10 font-medium text-frost transition-colors hover:border-glow/60 hover:bg-glow/20 ${sizeClasses}`}
      >
        {label}
        <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
      </a>
    </Magnetic>
  );
}
