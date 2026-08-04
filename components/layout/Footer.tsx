export function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-10 text-center text-sm text-slate">
      <p>© {new Date().getFullYear()} Abhishek. Built with Next.js.</p>
      {/* TODO: link GitHub/LinkedIn once profiles are populated — see blueprint Section 5 (Contact) */}
    </footer>
  );
}
