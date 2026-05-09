export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm text-gray-500">
            © 2026 PDFCraft.
          </p>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="/terms" className="hover:text-gray-600">Terms</a>
            <a href="/privacy" className="hover:text-gray-600">Privacy Policy</a>
            <a href="/about" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}