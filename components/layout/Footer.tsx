import { T } from '@/components/i18n/T';

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
      {/* TODO: link GitHub/LinkedIn once profiles are populated — see blueprint Section 5 (Contact) */}
    </footer>
  );
}
