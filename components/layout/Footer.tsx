import Link from 'next/link';

import { T } from '@/components/i18n/T';
import { PRIVACY_PATH } from '@/lib/privacy';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline px-6 py-10 text-center text-sm text-slate">
      <p>
        <T
          en={`© ${year} Abhishek. Built with Next.js.`}
          hi={`© ${year} Abhishek। Next.js से बनाया गया।`}
        />
      </p>
      <p className="mt-2">
        <Link href={PRIVACY_PATH} className="transition-colors hover:text-frost">
          <T en="Privacy Notice" hi="गोपनीयता सूचना" />
        </Link>
      </p>
      {/* TODO: link GitHub/LinkedIn once profiles are populated — see blueprint Section 5 (Contact) */}
    </footer>
  );
}
