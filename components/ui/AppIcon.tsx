import { Calculator, Images, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { AppEntry } from '@/data/apps';

const ICONS: Record<NonNullable<AppEntry['icon']>, LucideIcon> = {
  images: Images,
  calculator: Calculator,
  video: Video,
};

// Picks the lucide icon named by an app's `icon` field. Falls back to the
// gallery icon, which is what the first app (Abhi Gallery) has always used.
// To add an icon: import it above, add it to ICONS, and add its name to the
// `icon` union in data/apps.ts.
export function AppIcon({ icon = 'images', className }: { icon?: AppEntry['icon']; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} />;
}
