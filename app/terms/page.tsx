import { Scale, FileWarning, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors mb-8">
          <ArrowLeft size={16} /> Kembali ke Home
        </Link>

        <header className="mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 rounded-full">
            Versi 1.0 - Mei 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Syarat & Ketentuan
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Harap baca aturan main kami di bawah ini untuk memastikan pengalaman penggunaan yang lancar bagi semua orang.
          </p>
        </header>

        <div className="space-y-8">
          <div className="flex gap-6 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="hidden sm:flex shrink-0 w-12 h-12 bg-green-50 rounded-xl items-center justify-center text-green-600">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Lisensi Penggunaan</h3>
              <p className="text-slate-600 leading-relaxed">
                Anda diizinkan untuk menggunakan alat ini untuk keperluan pribadi maupun komersial secara gratis. Tidak diperlukan atribusi, meskipun kami akan sangat menghargainya jika Anda merekomendasikan kami kepada rekan Anda.
              </p>
            </div>
          </div>

          <div className="flex gap-6 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="hidden sm:flex shrink-0 w-12 h-12 bg-orange-50 rounded-xl items-center justify-center text-orange-600">
              <FileWarning size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Batasan Tanggung Jawab</h3>
              <p className="text-slate-600 leading-relaxed">
                Aplikasi ini disediakan "apa adanya" tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kehilangan data atau kerusakan file yang terjadi selama proses penggabungan. Selalu pastikan Anda memiliki cadangan file asli.
              </p>
            </div>
          </div>

          <div className="flex gap-6 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="hidden sm:flex shrink-0 w-12 h-12 bg-indigo-50 rounded-xl items-center justify-center text-indigo-600">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">3. Larangan</h3>
              <p className="text-slate-600 leading-relaxed">
                Anda dilarang mencoba merusak infrastruktur website ini, melakukan reverse engineering secara ilegal, atau menggunakan layanan kami untuk tujuan yang melanggar hukum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}