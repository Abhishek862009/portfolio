import { Calculator, Images } from 'lucide-react';

import type { AppEntry } from '@/data/apps';

// Picks the lucide icon named by an app's `icon` field. Falls back to the
// gallery icon, which is what the first app (Abhi Gallery) has always used.
export function AppIcon({ icon, className }: { icon?: AppEntry['icon']; className?: string }) {
  const Icon = icon === 'calculator' ? Calculator : Images;
  return <Icon className={className} />;
}
