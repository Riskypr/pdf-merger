import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 py-6 pb-24 sm:pb-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">DocuFlow</span>
          <span>•</span>
          <span>© 2026 Utilitas Dokumen Modern</span>
        </div>
        <nav className="flex items-center gap-5" aria-label="Tautan informasi">
          <Link href="/terms" className="font-medium text-slate-500 transition-colors hover:text-[#D91B24]">
            Ketentuan
          </Link>
          <Link href="/privacy" className="font-medium text-slate-500 transition-colors hover:text-[#D91B24]">
            Privasi
          </Link>
          <Link href="/about" className="font-medium text-slate-500 transition-colors hover:text-[#D91B24]">
            Tentang
          </Link>
        </nav>
      </div>
    </footer>
  );
}
